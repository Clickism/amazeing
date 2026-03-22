import type { PanelMinWidths } from "./components/CodeEditorWithPanel/CodeEditorWithPanel.tsx";

export const taskEditorMinWidths: PanelMinWidths = {
  codePanel: 300,
  sidePanel: 300,
  mobile: {
    codePanel: 600,
    sidePanel: 600,
  }
};

export const fileEditorMinWidths: PanelMinWidths = {
  codePanel: 320,
  sidePanel: 250,
  mobile: {
    codePanel: 600,
    sidePanel: 600,
  }
};
