import type { FileStorage } from "./fileStorage.ts";
import { usePersistentState, usePersistentStorage } from "../../../../shared/utils/storage.ts";
import { useCallback } from "react";

/**
 * Hook to manage file storage using persistent storage.
 * @param namespace The namespace for the storage.
 * @param storagePrefix The key prefix to store the file entries under.
 */
export function useFileStorage<T>(
  namespace: string,
  storagePrefix = "files",
): FileStorage<T> {
  const storage = usePersistentStorage(namespace);
  const [fileNames, setFileNames] = usePersistentState<string[]>(
    storage,
    "fileNames",
    [],
  );

  const fileKey = useCallback(
    (name: string) => `${storagePrefix}:${name}`,
    [storagePrefix],
  );

  const loadFile = useCallback(
    (name: string): T | null => {
      return storage.load(fileKey(name));
    },
    [fileKey, storage],
  );

  const saveFile = useCallback(
    (name: string, data: T) => {
      storage.save(fileKey(name), data);
      if (!fileNames.includes(name)) {
        setFileNames((prev) => [...prev, name]);
      }
    },
    [fileKey, fileNames, setFileNames, storage],
  );

  const deleteFile = useCallback(
    (name: string) => {
      storage.remove(fileKey(name));
      setFileNames((prev) => prev.filter((n) => n !== name));
    },
    [storage, fileKey, setFileNames],
  );

  const renameFile = useCallback(
    (oldName: string, newName: string) => {
      setFileNames((prev) => {
        // Prevent overwriting existing file
        if (prev.includes(newName)) return prev;
        // Prevent renaming non-existent file
        if (!prev.includes(oldName)) return prev;
        const newFileNames = prev.map((n) => (n === oldName ? newName : n));
        // Rename in storage
        const data = storage.load(fileKey(oldName));
        if (data !== null) {
          storage.save(fileKey(newName), data);
          storage.remove(fileKey(oldName));
        }
        return newFileNames;
      });
    },
    [fileKey, setFileNames, storage],
  );

  const exists = useCallback(
    (name: string) => fileNames.includes(name),
    [fileNames],
  );

  const isEmpty = useCallback(() => {
    return fileNames.length === 0;
  }, [fileNames]);

  return {
    fileNames: Array.from(fileNames),
    loadFile,
    saveFile,
    deleteFile,
    renameFile,
    exists,
    isEmpty,
    namespace,
  };
}
