import { useTranslation } from "react-i18next";
import { FaRegFolderClosed, FaRegFolderOpen } from "react-icons/fa6";
import { MultiSourceControls } from "../MultiSourceControls/MultiSourceControls.tsx";
import { FileList } from "./FileList/FileList.tsx";
import {
  CodeEditorWithPanel,
  type CodeEditorWithPanelProps,
} from "../CodeEditorWithPanel/CodeEditorWithPanel.tsx";
import { useCodeModel } from "../../context/code/CodeModelContext.tsx";
import { isMultiSource } from "../../context/source/source.ts";
import { fileEditorMinWidths } from "../../widths.ts";

type FileEditorProps = Partial<CodeEditorWithPanelProps> & {
  transitionDuration: number;
};

export function FileCodeEditor({ ...props }: FileEditorProps) {
  const { t } = useTranslation();
  const { code, setCode, source } = useCodeModel();
  if (!isMultiSource(source)) {
    throw new Error("FileCodeEditor can only be used with a multi-source.");
  }
  return (
    <CodeEditorWithPanel
      title={source.activeSource.name}
      code={code}
      setCode={setCode}
      topBar={{
        left: [<MultiSourceControls source={source} />],
      }}
      panel={{
        name: t("codeEditor.files"),
        content: <FileList source={source} />,
        icon: (open) => (open ? <FaRegFolderOpen /> : <FaRegFolderClosed />),
        minPixels: [
          fileEditorMinWidths.codePanel,
          fileEditorMinWidths.sidePanel,
        ],
        initialSizes: [0.7, 0.3],
      }}
      {...props}
    />
  );
}
