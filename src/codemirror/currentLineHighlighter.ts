import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";

const CLASS_ACTIVE_NAME = "cm-execLine";

export const currentLineHighlighter = (getLine: () => number | null) =>
  ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
      }

      update(update: ViewUpdate) {
        if (
          update.docChanged ||
          update.selectionSet ||
          update.viewportChanged
        ) {
          this.decorations = this.buildDecorations(update.view);
        }
      }

      buildDecorations(view: EditorView) {
        const lineNumber = getLine();
        const doc = view.state.doc;

        if (lineNumber == null || lineNumber < 1 || lineNumber > doc.lines) {
          return Decoration.none;
        }

        const line = doc.line(lineNumber);
        const builder = new RangeSetBuilder<Decoration>();
        builder.add(
          line.from,
          line.from,
          Decoration.line({
            class: CLASS_ACTIVE_NAME,
          }),
        );
        return builder.finish();
      }
    },
    {
      decorations: (v) => v.decorations,
    },
  );
