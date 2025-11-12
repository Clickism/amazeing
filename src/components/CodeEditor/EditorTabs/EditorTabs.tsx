import { useCodeStorage } from "../../../hooks/useCodeStorage.ts";
import { Button } from "../../ui/Button/Button.tsx";
import { FaPlus } from "react-icons/fa6";
import styles from "./EditorTabs.module.css";
import { BiTrash } from "react-icons/bi";

export type EditorTabsProps = {
  activeFile: string;
  setActiveFile: (fileName: string | null) => void;
};

export function EditorTabs({ activeFile, setActiveFile }: EditorTabsProps) {
  const { fileNames, saveFile, deleteFile } = useCodeStorage();
  return (
    <div className={styles.container}>
      {fileNames.map((name) => (
        <div
          key={name}
          className={name === activeFile ? styles.activeTab : styles.tab}
        >
          <Button
            variant={name === activeFile ? "secondary" : "disabled"}
            onClick={() => setActiveFile(name)}
          >
            {name}
          </Button>
          {name === activeFile && (
            <Button
              variant="danger"
              shape="icon"
              size="small"
              onClick={() => {
                if (fileNames.length === 1) {
                  setActiveFile(null);
                } else {
                  const idx = fileNames.indexOf(name);
                  const newActive =
                    idx > 0 ? fileNames[idx - 1] : fileNames[idx + 1];
                  setActiveFile(newActive);
                }
                deleteFile(name);
              }}
            >
              <BiTrash />
            </Button>
          )}
        </div>
      ))}
      <Button
        variant="primary"
        shape="icon"
        onClick={() => {
          const name = `Untitled #${fileNames.length + 1}`;
          saveFile({ name, content: "# Write your code here" });
          setActiveFile(name);
        }}
      >
        <FaPlus />
      </Button>
    </div>
  );
}
