import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import "./css/colors.css";
import "./css/border.css";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes.tsx";
import { EditorThemeProvider } from "./context/EditorThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EditorThemeProvider>
        <AppRoutes />
      </EditorThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
