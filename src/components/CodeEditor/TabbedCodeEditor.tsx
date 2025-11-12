import { useCodeStorage } from "../../hooks/useCodeStorage.ts";
import { useEffect, useState } from "react";
import { CodeEditor, type CodeEditorProps } from "./CodeEditor.tsx";

type TabbedEditorProps = {
  startingFileName?: string;
} & Omit<CodeEditorProps, "tabbed">;

export function TabbedCodeEditor({
  startingFileName,
  ...props
}: TabbedEditorProps) {
  const { fileNames, saveFile } = useCodeStorage();
  const [fileName, setFileName] = useState<string | null>(
    startingFileName ?? fileNames[0],
  );
  useEffect(() => {
    if (fileNames.length === 0) {
      saveFile({ name: "Untitled", content: "# Write your code here" });
    }
  }, [fileNames, saveFile]);
  return (
    <CodeEditor
      tabbed
      fileName={fileName ?? "Untitled"}
      setFileName={setFileName}
      {...props}
    />
  );
}
