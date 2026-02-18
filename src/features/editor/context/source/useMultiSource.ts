import type { MultiSource } from "./source.ts";
import type { FileStorage } from "../storage/fileStorage.ts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../../../shared/utils/storage.ts";
import { useAutoSave } from "../autosave/useAutoSave.ts";
import { findNextAvailableName, findNextName } from "../../utils.ts";

export type UseMultiSourceProps<T> = {
  /**
   * The default data to use for new sources, and for sources that fail to load.
   */
  defaultData: T;
  /**
   * File storage to use for saving resources.
   */
  fileStorage: FileStorage<T>;
  /**
   * Function to generate source name based on index, used for creating new sources.
   * @param index The index to generate the name for, starting from 1.
   */
  fileNameFormat: (index: number) => string;
  /**
   * Namespace to save active source, if not provided,
   * the FileStorage's namespace will be used.
   */
  namespace?: string;
};

/**
 * Hook to manage multiple sources using a FileStorage.
 * @param defaultData The default data to use for new sources.
 * @param namespace The namespace to save active source, if not provided, the file storage's namespace will be used.
 * @param fileStorage The file storage to use for managing sources.
 * @param fileNameFormat Function to generate new source names based on index.
 */
export function useMultiSource<T>({
  defaultData,
  namespace,
  fileStorage,
  fileNameFormat,
}: UseMultiSourceProps<T>): MultiSource<T> {
  const [data, setData] = useState<T>(defaultData);
  const storage = usePersistentStorage(namespace ?? fileStorage.namespace);
  const [activeName, setActiveName] = usePersistentState<string | null>(
    storage,
    "activeSource",
    null,
  );

  // Set up auto-save
  const { flush } = useAutoSave(data, () => {
    if (activeName === null) return;
    fileStorage.saveFile(activeName, data);
  });

  const switchSource = useCallback(
    (name: string, skipFlush = false) => {
      if (!skipFlush) flush(); // Save before switching
      const content = fileStorage.loadFile(name);
      if (content !== null) {
        setData(content);
        setActiveName(name);
      }
    },
    [fileStorage, flush, setActiveName],
  );

  const newSource = useCallback(
    (skipFlush = false) => {
      if (!skipFlush) flush(); // Save before creating new source
      const name = findNextAvailableName(fileNameFormat, fileStorage.fileNames);
      fileStorage.saveFile(name, defaultData);
      setData(defaultData);
      setActiveName(name);
    },
    [defaultData, fileNameFormat, fileStorage, flush, setActiveName],
  );

  const renameSource = useCallback(
    (newName: string) => {
      if (activeName == null) return;
      flush(); // Save before renaming
      if (fileStorage.exists(newName)) {
        console.warn(`Source with name "${newName}" already exists.`);
        return;
      }
      fileStorage.renameFile(activeName, newName);
      setActiveName(newName);
    },
    [activeName, fileStorage, flush, setActiveName],
  );

  const deleteSource = useCallback(() => {
    if (activeName == null) return;
    if (!fileStorage.exists(activeName)) return;
    // Find next source
    const nextSource = findNextName(activeName, fileStorage.fileNames);
    // Delete current source
    fileStorage.deleteFile(activeName);
    // Switch to next source if exists, or create new one
    if (nextSource) {
      switchSource(nextSource, true); // Skip flush to not save deleted source
    } else {
      newSource(true); // Skip flush to not save deleted source
    }
  }, [activeName, fileStorage, newSource, switchSource]);

  // Initialize sources
  const initializedRef = useRef(false);
  useEffect(() => {
    // Check if initialized before
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Load active source from storage
    if (activeName !== null) {
      const content = fileStorage.loadFile(activeName);
      if (content !== null) {
        setData(content);
        return;
      }
    }

    // Create new source if no active source or failed to load
    if (fileStorage.isEmpty()) {
      newSource(true); // Skip flush to not save empty source
    } else {
      // Load first source
      const firstSource = fileStorage.fileNames[0];
      switchSource(firstSource, true); // Skip flush to not save empty source
    }
  }, [activeName, fileStorage, newSource, switchSource]);

  // Active source object
  const activeSource = useMemo(
    () => ({
      name: activeName ?? "",
      data,
      setData,
    }),
    [activeName, data],
  );

  return {
    activeSource,
    sourceNames: fileStorage.fileNames,
    switchSource,
    renameSource,
    deleteSource,
    newSource,
  };
}
