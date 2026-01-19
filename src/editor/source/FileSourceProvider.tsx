import { SourceContext } from "./SourceContext.tsx";
import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { useCodeStorage } from "../storage/CodeStorageContext.tsx";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../utils/storage.ts";
import { useTranslation } from "react-i18next";

const AUTO_SAVE_INTERVAL = 5000; // ms

type FileSourceProviderProps = {
  // Should be stable
  code: string;
  setCode: (code: string) => void;
  children?: ReactNode;
};

export function FileSourceProvider({
  code,
  setCode,
  children,
}: FileSourceProviderProps) {
  const { t } = useTranslation();
  const {
    fileNames,
    loadFile,
    saveFile,
    deleteFile,
    renameFile,
    fileNamespace,
  } = useCodeStorage();
  const storage = usePersistentStorage(fileNamespace);

  const newFileName = useCallback(() => {
    let i = 1;
    let name: string;
    do {
      name = t("codeStorage.newFile.name", { num: i++ });
    } while (fileNames.includes(name));
    return name;
  }, [fileNames, t]);

  const [activeFile, setActiveFile] = usePersistentState<string | null>(
    storage,
    "activeFile",
    null,
  );

  const savedCodeRef = useRef<string | null>(null);
  const codeRef = useRef(code);

  // Keep ref updated
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  const saveCode = useCallback(
    (content?: string) => {
      if (activeFile === null) return;
      if (content === undefined) {
        content = codeRef.current;
      }
      console.log("saveCode", content);
      saveFile(activeFile, content);
      savedCodeRef.current = content;
    },
    [activeFile, saveFile],
  );

  const createNewFile = useCallback(() => {
    const name = newFileName();
    const content = t("codeStorage.newFile.content");
    setActiveFile(name);
    saveFile(name, content);
    savedCodeRef.current = content;
  }, [newFileName, saveFile, setActiveFile, t]);

  const switchSource = useCallback(
    (name: string, saveCurrent = true) => {
      console.log("switchSource", name);
      if (saveCurrent && activeFile !== null) {
        saveCode();
      }
      const newCode = loadFile(name);
      if (newCode !== null) {
        setActiveFile(name);
        setCode(newCode);
        savedCodeRef.current = newCode;
      }
    },
    [activeFile, loadFile, saveCode, setActiveFile, setCode],
  );

  const loadSource = useCallback(() => {
    if (activeFile == null) return null;
    return loadFile(activeFile);
  }, [activeFile, loadFile]);

  const saveSource = useCallback(
    (code: string) => {
      saveCode(code);
    },
    [saveCode],
  );

  const renameSource = useCallback(
    (newName: string) => {
      if (activeFile == null) return;
      renameFile(activeFile, newName);
      setActiveFile(newName);
    },
    [activeFile, renameFile, setActiveFile],
  );

  const deleteSource = useCallback(() => {
    if (activeFile == null) return;
    const idx = fileNames.indexOf(activeFile);
    const newFileNames = fileNames.filter((_, i) => i !== idx);
    if (idx == -1) return;
    deleteFile(activeFile);
    if (newFileNames.length > 0) {
      const next = newFileNames[Math.max(0, idx - 1)];
      switchSource(next, false);
    } else {
      const next = newFileName();
      const content = t("codeStorage.newFile.content");
      saveFile(next, content);
      switchSource(next, false);
    }
  }, [
    activeFile,
    deleteFile,
    fileNames,
    newFileName,
    saveFile,
    switchSource,
    t,
  ]);

  // Initial file
  useEffect(() => {
    if (activeFile !== null) {
      const content = loadFile(activeFile);
      if (content !== null) {
        setCode(content);
      }
      return;
    }
    if (fileNames.length > 0) {
      switchSource(fileNames[0]);
    } else {
      createNewFile();
    }
  }, [activeFile, createNewFile, fileNames, loadFile, setCode, switchSource]);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      const code = codeRef.current;
      if (savedCodeRef.current === code) return;
      saveCode(code);
      console.log("Saved code!");
    }, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [saveCode]);

  // Save on close
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCode();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveCode]);

  return (
    <SourceContext.Provider
      value={{
        name: activeFile || "",
        loadSource,
        saveSource,
        renameSource,
        deleteSource,
        switchSource,
        sourceNames: fileNames,
      }}
    >
      {children}
    </SourceContext.Provider>
  );
}
