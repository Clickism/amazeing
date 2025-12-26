import { Button } from "../../../../components/Button/Button.tsx";
import { FaPlus } from "react-icons/fa6";
import styles from "./FileList.module.css";
import { BiPencil, BiTrash } from "react-icons/bi";
import { useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Popup from "reactjs-popup";
import { useCodeStorage } from "../../../storage/CodeStorageContext.tsx";

export type FileListProps = {
  activeFile: string;
  setActiveFile: (fileName: string | null, saveOld?: boolean) => void;
};

export function FileList({ activeFile, setActiveFile }: FileListProps) {
  const { t } = useTranslation();
  const { fileNames, saveFile, deleteFile, renameFile } = useCodeStorage();
  const [renamingFile, setRenamingFile] = useState<string | null>(null);

  function createFile() {
    const name = `Untitled #${fileNames.length + 1}`;
    saveFile({ name, content: "# Write your code here" });
    setActiveFile(name);
  }

  function handleDeleteFile(name: string) {
    if (!confirm(`Are you sure you want to delete the file "${activeFile}"?`)) {
      return;
    }
    if (fileNames.length === 1) {
      setActiveFile(null);
    } else {
      const idx = fileNames.indexOf(name);
      const newActive = idx > 0 ? fileNames[idx - 1] : fileNames[idx + 1];
      setActiveFile(newActive);
    }
    deleteFile(name);
  }

  return (
    <div className={styles.container}>
      {fileNames.map((name) => (
        <div
          key={name}
          className={clsx(
            name === activeFile && styles.activeTabContainer,
            styles.tabContainer,
          )}
        >
          <Button
            variant={name === activeFile ? "secondary" : "background"}
            onClick={() => setActiveFile(name)}
            className={clsx(
              renamingFile === name && styles.renamingTab,
              styles.tab,
            )}
          >
            {renamingFile === name ? (
              <input
                type="text"
                defaultValue={name}
                autoFocus
                style={{
                  width: "12ch",
                }}
                className={styles.renameInput}
                onBlur={(e) => {
                  const newName = e.target.value.trim();
                  if (newName && newName !== name) {
                    setActiveFile(name, true); // Save current file
                    renameFile(name, newName);
                    setActiveFile(newName, false);
                  }
                  setRenamingFile(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  } else if (e.key === "Escape") {
                    setRenamingFile(null);
                  }
                }}
              />
            ) : (
              <>{name}</>
            )}
          </Button>
          {name === activeFile && (
            <div className={styles.tabButtons}>
              <Button
                variant="secondary"
                shape="icon"
                size="small"
                onClick={() => {
                  setRenamingFile(name);
                }}
              >
                <BiPencil />
              </Button>
              <Popup>
                <div>{t("fileList.deleteConfirm")}</div>
                <Button
                  variant="danger"
                  shape="icon"
                  size="small"
                  onClick={() => handleDeleteFile(name)}
                >
                  <BiTrash /> {t("fileList.delete")}
                </Button>
              </Popup>
              <Button
                variant="danger"
                shape="icon"
                size="small"
                onClick={() => handleDeleteFile(name)}
              >
                <BiTrash />
              </Button>
            </div>
          )}
        </div>
      ))}
      <Button variant="outlined" onClick={createFile}>
        <FaPlus /> {t("fileList.newFile")}
      </Button>
    </div>
  );
}
