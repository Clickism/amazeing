import {
  EditorView,
  GutterMarker,
  lineNumberMarkers,
  lineNumbers,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

export const lineNumbersClickable = (onClick: (line: number) => void) =>
  lineNumbers({
    domEventHandlers: {
      click: (view, block) => {
        const line = view.state.doc.lineAt(block.from).number;
        onClick(line);
        return true;
      },
    },
  });

class BreakpointMarker extends GutterMarker {
  elementClass = "cm-breakpoint";
}

const marker = new BreakpointMarker();

export const breakpointDisplay = (breakpoints: number[]) =>
  lineNumberMarkers.computeN([], (state) => {
    const builder = new RangeSetBuilder<GutterMarker>();

    for (const line of breakpoints.sort((a, b) => a - b)) {
      if (!line) continue;

      const lineInfo = state.doc.line(line);
      builder.add(lineInfo.from, lineInfo.from, marker);
    }

    return [builder.finish()];
  });

export const breakpointTheme = EditorView.baseTheme({
  ".cm-breakpoint": {
    color: "var(--clr-danger-a10)",
    opacity: 1,
    "text-shadow": `0 0 2px var(--clr-danger-a0), 0 0 5px var(--clr-danger-a0)`,
    fontWeight: "bold",
  },
  ".cm-gutterElement.cm-breakpoint:hover": {
    color: "var(--clr-danger-a20)",
    opacity: 1,
    "text-shadow": `0 0 2px var(--clr-danger-a0), 0 0 5px var(--clr-danger-a0)`,
    fontWeight: "bold",
  },
  ".cm-gutterElement": {
    cursor: "pointer",
  },
  ".cm-gutterElement:hover": {
    color: "var(--clr-danger-a10)",
    opacity: 1,
    "text-shadow": `0 0 2px var(--clr-danger-a0), 0 0 5px var(--clr-danger-a0)`,
  },
});
