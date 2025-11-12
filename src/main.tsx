import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import "./css/colors.css";
import "./css/border.css";
import "./css/popup.css";
import "./css/form.css";
import "./css/codemirror.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { EditorSettingsProvider } from "./context/EditorSettingsProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EditorSettingsProvider>
        <AppRoutes />
      </EditorSettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);
