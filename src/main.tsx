import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import "./css/colors.css";
import "./css/border.css";
import "./css/form.css";
import "./css/codemirror.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { CodeEditorSettingsProvider } from "./editor/settings/CodeEditorSettingsProvider.tsx";
import { ColorSchemeProvider } from "./theme/ColorSchemeProvider.tsx";
import { EditorThemeProvider } from "./theme/EditorThemeProvider.tsx";
import { NavBar } from "./components/NavBar/NavBar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ColorSchemeProvider namespace="global">
        <EditorThemeProvider namespace="editor">
          <CodeEditorSettingsProvider namespace="code-editor">
            <NavBar />
            <AppRoutes />
          </CodeEditorSettingsProvider>
        </EditorThemeProvider>
      </ColorSchemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
