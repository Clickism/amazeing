import { Layout } from "../components/Layout/Layout.tsx";
import { CodeStorageProvider } from "../context/CodeStorageProvider.tsx";
import { Editor } from "../components/Editor/Editor.tsx";

export function SandboxPage() {
  return (
    <Layout fullWidth>
      <CodeStorageProvider fileNamespace="sandbox">
        <Editor tabbed />
      </CodeStorageProvider>
    </Layout>
  );
}
