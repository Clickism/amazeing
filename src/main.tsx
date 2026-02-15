import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./shared/css/index.css";
import "./shared/css/colors.css";
import "./shared/css/border.css";
import "./shared/css/form.css";
import "./shared/css/codemirror.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { CodeEditorSettingsProvider } from "./features/editor/settings/CodeEditorSettingsProvider.tsx";
import { ColorSchemeProvider } from "./shared/theme/ColorSchemeProvider.tsx";
import { EditorThemeProvider } from "./shared/theme/EditorThemeProvider.tsx";
import { NavBar } from "./shared/components/NavBar/NavBar.tsx";

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
