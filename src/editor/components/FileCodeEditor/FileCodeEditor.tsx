import type { Extension } from "@codemirror/state";
import { useTranslation } from "react-i18next";
import { FaRegFolderClosed, FaRegFolderOpen } from "react-icons/fa6";
import { FileControls } from "./FileControls/FileControls.tsx";
import { useFileSource } from "../../source/SourceContext.tsx";
import { FileList } from "./FileList/FileList.tsx";
import { CodeEditorWithPanel } from "../CodeEditorWithPanel/CodeEditorWithPanel.tsx";

type FileEditorProps = {
  setCode: (code: string) => void;
  editorExtensions?: Extension[];
  transitionDuration: number;
};

export function FileCodeEditor({
  editorExtensions,
  setCode,
  transitionDuration,
}: FileEditorProps) {
  const { t } = useTranslation();
  const { name, loadSource } = useFileSource();
  return (
    <CodeEditorWithPanel
      title={name}
      code={loadSource() || ""}
      setCode={setCode}
      editorExtensions={editorExtensions}
      transitionDuration={transitionDuration}
      topBar={{
        left: [<FileControls />],
      }}
      panel={{
        name: t("codeEditor.files"),
        content: <FileList />,
        icon: (open) => (open ? <FaRegFolderOpen /> : <FaRegFolderClosed />),
      }}
    />
  );
}
