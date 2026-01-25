import type { Extension } from "@codemirror/state";
import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "../../../components/Button/Button.tsx";
import styles from "./FileEditor.module.css";
import { useTranslation } from "react-i18next";
import { FaRegFolderClosed, FaRegFolderOpen } from "react-icons/fa6";
import { FileControls } from "./FileControls/FileControls.tsx";
import { useSource } from "../../source/SourceContext.tsx";
import { FileList } from "./FileList/FileList.tsx";
import { Panel } from "../../../components/Panel/Panel.tsx";

type FileEditorProps = {
  setCode: (code: string) => void;
  editorExtensions?: Extension[];
  transitionDuration: number;
};

export function FileEditor({
  editorExtensions,
  setCode,
  transitionDuration,
}: FileEditorProps) {
  const { t } = useTranslation();
  const { name, loadSource } = useSource();
  const [filesOpen, setFilesOpen] = useState(false);
  return (
    <div className={styles.container}>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={styles.editorContainer}
      >
        <Panel paddingless>
          <CodeEditor
            title={name}
            code={loadSource() || ""}
            setCode={setCode}
            editorExtensions={editorExtensions}
            topBar={{
              leftContent: <FileControls />,
              rightContent: (
                <Button onClick={() => setFilesOpen((prev) => !prev)}>
                  {filesOpen ? <FaRegFolderOpen /> : <FaRegFolderClosed />}
                  {t("codeEditor.files")}
                </Button>
              ),
            }}
            transitionDuration={transitionDuration}
          />
        </Panel>
      </motion.div>
      <AnimatePresence mode="popLayout">
        {filesOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Panel paddingless>
              <FileList />
            </Panel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
