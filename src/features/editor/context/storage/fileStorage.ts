/**
 * File storage interface.
 */
export type FileStorage<T> = {
  fileNames: readonly string[];
  loadFile: (name: string) => T | null;
  saveFile: (name: string, data: T) => void;
  deleteFile: (name: string) => void;
  renameFile: (oldName: string, newName: string) => void;
  exists: (name: string) => boolean;
  isEmpty: () => boolean;
  namespace: string;
};
