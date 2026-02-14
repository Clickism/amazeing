import { useCallback, useEffect, useRef } from "react";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../utils/storage.ts";
import { findNextName } from "../utils.ts";
import { type SourceAPI } from "./SourceContext.tsx";

const AUTO_SAVE_INTERVAL = 5000; // ms

type SourceProviderProps<T> = {
  source: T;
  setSource: (source: T) => void;
  createNewSource: (first: boolean) => { name: string; content: T };
  storageNamespace: string;
  fileStorage: {
    fileNames: string[];
    loadFile: (name: string) => T | null;
    saveFile: (name: string, content: T) => void;
    deleteFile: (name: string) => void;
    renameFile: (oldName: string, newName: string) => void;
  };
};

export function useSourceApi<T>({
  source,
  setSource,
  storageNamespace,
  createNewSource,
  fileStorage,
}: SourceProviderProps<T>): SourceAPI<T> {
  const storage = usePersistentStorage(storageNamespace);

  const [activeSource, setActiveSource] = usePersistentState<string | null>(
    storage,
    "activeSource",
    null,
  );

  const savedSourceRef = useRef<T | null>(null);
  const sourceRef = useRef(source);

  // Keep ref updated
  useEffect(() => {
    sourceRef.current = source;
  }, [source]);

  const saveContent = useCallback(
    (content?: T) => {
      if (activeSource === null) return;
      if (content === undefined) {
        content = sourceRef.current;
      }
      fileStorage.saveFile(activeSource, content);
      savedSourceRef.current = content;
    },
    [activeSource, fileStorage],
  );

  const newSource = useCallback(() => {
    const { name, content } = createNewSource(false);
    setActiveSource(name);
    fileStorage.saveFile(name, content);
    savedSourceRef.current = content;
  }, [createNewSource, fileStorage, setActiveSource]);

  const switchSource = useCallback(
    (name: string, saveCurrent = true, content: T | undefined = undefined) => {
      if (saveCurrent && activeSource !== null) {
        saveContent();
      }
      const newContent = content ?? fileStorage.loadFile(name);
      if (newContent !== null) {
        setActiveSource(name);
        setSource(newContent);
        savedSourceRef.current = newContent;
      }
    },
    [activeSource, fileStorage, saveContent, setActiveSource, setSource],
  );

  const loadSource = useCallback(() => {
    if (activeSource == null) return null;
    return fileStorage.loadFile(activeSource);
  }, [activeSource, fileStorage]);

  const saveSource = useCallback(
    (content: T) => {
      saveContent(content);
    },
    [saveContent],
  );

  const renameSource = useCallback(
    (newName: string) => {
      if (activeSource == null) return;
      fileStorage.renameFile(activeSource, newName);
      setActiveSource(newName);
    },
    [activeSource, fileStorage, setActiveSource],
  );

  const deleteSource = useCallback(() => {
    if (activeSource == null) return;
    if (!fileStorage.fileNames.includes(activeSource)) return;
    fileStorage.deleteFile(activeSource);
    const nextName = findNextName(activeSource, fileStorage.fileNames);
    if (nextName !== null) {
      switchSource(nextName, false);
    } else {
      const { name: next, content } = createNewSource(true);
      fileStorage.saveFile(next, content);
      switchSource(next, false, content);
    }
  }, [activeSource, createNewSource, fileStorage, switchSource]);

  const prevActiveSourceRef = useRef(activeSource);
  const initializedRef = useRef(false);

  // Initial file
  useEffect(() => {
    // Only run on activeSource change, not on every render
    if (prevActiveSourceRef.current !== activeSource) {
      prevActiveSourceRef.current = activeSource;
      initializedRef.current = false;
    }
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (activeSource !== null) {
      const content = fileStorage.loadFile(activeSource);
      if (content !== null) {
        setSource(content);
      }
      return;
    }
    if (fileStorage.fileNames.length > 0) {
      switchSource(fileStorage.fileNames[0]);
    } else {
      newSource();
    }
  }, [activeSource, fileStorage, newSource, setSource, switchSource]);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      const code = sourceRef.current;
      if (savedSourceRef.current === code) return;
      saveContent(code);
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [saveContent]);

  // Save on close
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveContent();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveContent]);

  return {
    name: activeSource ?? "",
    source,
    setSource,
    loadSource,
    saveSource,
    renameSource,
    deleteSource,
    switchSource,
    sourceNames: fileStorage.fileNames,
    newSource,
  };
}
