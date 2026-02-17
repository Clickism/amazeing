import type { FileStorage } from "./fileStorage.ts";
import { usePersistentState, usePersistentStorage } from "../../../../shared/utils/storage.ts";
import { useCallback } from "react";

/**
 * Hook to manage file storage using persistent storage.
 * @param namespace The namespace for the storage.
 * @param storageKey The key to store the file entries under.
 */
export function useFileStorage<T>(
  namespace: string,
  storageKey = "files",
): FileStorage<T> {
  const storage = usePersistentStorage(namespace);
  const [entries, setEntries] = usePersistentState<Record<string, T>>(
    storage,
    storageKey,
    {},
  );
  const fileNames = Object.keys(entries);

  const loadFile = useCallback(
    (name: string): T | null => {
      return entries[name] ?? null;
    },
    [entries],
  );

  const saveFile = useCallback(
    (name: string, data: T) => {
      setEntries((prev) => ({
        ...prev,
        [name]: data,
      }));
    },
    [setEntries],
  );

  const deleteFile = useCallback(
    (name: string) => {
      setEntries((prev) => {
        const newEntries = { ...prev };
        delete newEntries[name];
        return newEntries;
      });
    },
    [setEntries],
  );

  const renameFile = useCallback(
    (oldName: string, newName: string) => {
      setEntries((prev) => {
        // Prevent overwriting existing file
        if (prev[newName] !== undefined) return prev;
        const next = { ...prev };
        if (oldName in next) {
          next[newName] = next[oldName];
          delete next[oldName];
        }
        return next;
      });
    },
    [setEntries],
  );

  const exists = useCallback(
    (name: string) => {
      return name in entries;
    },
    [entries],
  );

  const isEmpty = useCallback(() => {
    return fileNames.length === 0;
  }, [fileNames]);

  return {
    fileNames,
    loadFile,
    saveFile,
    deleteFile,
    renameFile,
    exists,
    isEmpty,
    namespace,
  };
}
