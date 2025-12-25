import { useEffect, useState } from "react";
import { CodeEditor, type CodeEditorProps } from "./CodeEditor.tsx";
import { useCodeStorage } from "../../context/CodeStorageContext.tsx";

type TabbedEditorProps = {
  startingFileName?: string;
} & Omit<CodeEditorProps, "tabbed">;

export function TabbedCodeEditor({
  startingFileName,
  ...props
}: TabbedEditorProps) {
  const { fileNames, saveFile, setActiveFile, getActiveFile } =
    useCodeStorage();
  const [fileName, setFileName] = useState<string | null>(
    startingFileName ?? getActiveFile() ?? fileNames[0],
  );
  useEffect(() => {
    if (fileNames.length === 0) {
      saveFile({ name: "Untitled", content: "# Write your code here" });
    }
  }, [fileNames, saveFile]);
  // Save active file
  useEffect(() => {
    if (fileName !== null) {
      setActiveFile(fileName);
    }
  }, [fileName, setActiveFile]);
  return (
    <CodeEditor
      tabbed
      fileName={fileName ?? "Untitled"}
      setFileName={setFileName}
      {...props}
    />
  );
}
