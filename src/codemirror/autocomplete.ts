import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { INSTRUCTION_DOCUMENTATIONS } from "./documentation.ts";
import { classHighlighter, highlightCode } from "@lezer/highlight";
import { ALL_INSTRUCTIONS } from "../interpreter/instruction.ts";
import { StreamLanguage } from "@codemirror/language";
import { keywordPattern } from "./amazeing.ts";

export const docLanguage = StreamLanguage.define({
  startState() {
    return {};
  },
  token(stream) {
    if (stream.eatSpace()) return null;
    if (stream.match(/#.*/)) return "comment";
    if (stream.match(keywordPattern)) {
      return "keyword";
    }
    if (stream.match(/[<>]/)) return "operator";
    if (stream.match(/[a-zA-Z_0-9]*:/)) return "string";
    if (stream.match(/[a-zA-Z_0-9]/)) return "type";
    stream.next();
    return null;
  },
});

function extractVariables(docText: string): string[] {
  const regex = /\bvar\s+([A-Za-z_]\w*)/g;
  const vars: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(docText))) {
    const name = match[1];
    if (!vars.includes(name)) vars.push(name);
  }

  return vars;
}

function amazeingCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const docText = context.state.doc.toString();
  const variables = extractVariables(docText);

  const before = context.state.sliceDoc(0, word.from).trimEnd();
  const lastWordMatch = /\b(\w+)\b\s*$/.exec(before);
  const prevWord = lastWordMatch ? lastWordMatch[1] : null;

  if (prevWord === "var") {
    return {
      from: word.from,
      options: [
        { label: "newVar", type: "variable", info: "Define a new variable" },
      ],
    };
  }

  return {
    from: word.from,
    options: [
      ...ALL_INSTRUCTIONS.map(getCompletion),
      ...variables.map((v) => ({
        label: v,
        type: "variable",
        info: `Previously declared variable '${v}'`,
      })),
    ],
  };
}

function getCompletion(instruction: string) {
  const doc =
    INSTRUCTION_DOCUMENTATIONS[
      instruction as keyof typeof INSTRUCTION_DOCUMENTATIONS
    ];
  return {
    label: instruction,
    type: "keyword",
    // Styling handled in codemirror.css
    info: () => {
      const div = document.createElement("div");

      if (!doc) {
        div.textContent = `Amazeing instruction "${instruction}"`;
        return div;
      }

      const usage = document.createElement("pre");
      usage.className = "usage";

      const putText = (text: string, classes: string) => {
        let node: Node = document.createTextNode(text);
        if (classes) {
          const span = document.createElement("span");
          span.appendChild(node);
          span.className = classes;
          node = span;
        }
        usage.appendChild(node);
      };

      const putBreak = () => {
        usage.appendChild(document.createTextNode("\n"));
      };

      highlightCode(
        doc.usage,
        docLanguage.parser.parse(doc.usage),
        classHighlighter,
        putText,
        putBreak,
      );

      div.appendChild(usage);

      const warning = document.createElement("div");
      if (doc.warning) {
        warning.textContent = doc.warning;
        warning.className = "warning";
        div.appendChild(warning);
      }

      const desc = document.createElement("div");
      desc.textContent = doc.description;
      desc.className = "description";

      div.appendChild(desc);
      return div;
    },
  };
}

export const amazeingAutocomplete = autocompletion({
  override: [amazeingCompletions],
});
