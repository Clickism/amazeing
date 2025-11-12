import { StreamLanguage } from "@codemirror/language";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";

const amazeingKeywords = [
  "move",
  "turn",
  "var",
  "load",
  "copy",
  "add",
  "sub",
  "mul",
  "div",
  "and",
  "or",
  "xor",
  "not",
  "lt",
  "lte",
  "gt",
  "gte",
  "eq",
  "neq",
  "jump",
  "call",
  "ret",
  "exit",
  "branch",
  "branchz",
  "print",
];

const keywordPattern = new RegExp(
  `\\b(${amazeingKeywords.join("|")})\\b`,
);

export const amazeing = StreamLanguage.define({
  startState() {
    return { afterVar: false };
  },
  token(stream, state) {
    if (stream.eatSpace()) return null;
    if (stream.match(/#.*/)) return "comment";
    if (state.afterVar && stream.match(/\w+/)) {
      state.afterVar = false; // reset
      return "variableName";
    }
    // TODO: Keywords in identifiers get highlighted
    if (stream.match(keywordPattern)) {
      state.afterVar = stream.current() === "var";
      return "keyword";
    }
    if (stream.match(/\barg\d+/)) return "string";
    if (stream.match(/\b\d+\b/)) return "number";
    if (stream.match(/\b\w+(?=:)/)) return "def";
    if (stream.match(/[=+\-*/:]/)) return "operator";
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
      ...amazeingKeywords.map(k => ({
        label: k,
        type: "keyword",
        info: `Amazeing instruction '${k}'`,
      })),
      ...variables.map(v => ({
        label: v,
        type: "variable",
        info: `Previously declared variable '${v}'`,
      })),
    ],
  };
}

export const amazeingAutocomplete = autocompletion({
  override: [amazeingCompletions],
});
