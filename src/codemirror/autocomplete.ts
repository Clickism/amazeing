import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import {
  type Documentation,
  INSTRUCTION_DOCUMENTATIONS,
  type SingleDocumentation,
} from "./documentation.ts";
import { classHighlighter, highlightCode } from "@lezer/highlight";
import { ALL_INSTRUCTIONS } from "../interpreter/instruction.ts";
import { StreamLanguage } from "@codemirror/language";
import { keywordPattern } from "./amazeing.ts";

// TODO: No instruction autocomplete after the instruction name
export const docLanguage = StreamLanguage.define({
  startState() {
    return {};
  },
  token(stream) {
    if (stream.eatSpace()) return null;
    if (stream.match(/^[0-9]+/)) return "number";
    if (stream.match(/#.*/)) return "comment";
    if (stream.match(keywordPattern)) {
      return "keyword";
    }
    if (stream.match(/[<>[\]]/)) return "operator";
    if (stream.match(/[a-zA-Z_0-9]*:/)) return "string";
    if (stream.match(/[a-zA-Z_0-9]/)) return "type";
    stream.next();
    return null;
  },
});

type VariableDeclaration = { name: string; line: number; isArray: boolean };

function extractVariables(context: CompletionContext): VariableDeclaration[] {
  const docText = context.state.doc.toString();
  const regex = /\bvar\s+([A-Za-z_][A-Za-z_0-9]*)(\[])?/;
  const vars: Map<string, VariableDeclaration> = new Map();
  const lines = docText.split("\n");
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    const currentLineNumber = context.state.doc.lineAt(context.pos).number;
    if (currentLineNumber === lineNumber + 1) {
      continue;
    }
    const line = lines[lineNumber];
    const match = regex.exec(line);
    if (match) {
      const name = match[1];
      const isArray = match[2];
      if (!vars.has(name)) {
        vars.set(name, {
          name,
          line: lineNumber + 1,
          isArray: isArray !== undefined,
        });
      }
    }
  }

  return Array.from(vars.values());
}

// TODO: No autocompletion in comments
// TODO: Also maybe new instruction "printm" that takes different printing modes, ascii or sth?? or just "printascii"
function amazeingCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;
  const state = extractCompletionState(context);
  if (!state) return null;
  // Don't autocomplete if naming variable or in comment
  if (state.prevWord === "var" || state.inComment) {
    return null;
  }

  const variables = extractVariables(context);
  return {
    from: word.from,
    options: [
      ...ALL_INSTRUCTIONS.map(getCompletion),
      ...variables.map(getVariableCompletion),
    ],
  };
}

type CompletionState = {
  prevWord: string | null;
  inComment: boolean;
};

function extractCompletionState(
  context: CompletionContext,
): CompletionState | null {
  const word = context.matchBefore(/\w*/);
  if (!word) {
    return null;
  }
  const line = context.state.doc.lineAt(context.pos);

  // Get previous word
  const before = line.text.slice(0, -word.text.length).trimEnd();
  const lastWordMatch = /\b(\w+)\b\s*$/.exec(before);
  const prevWord = lastWordMatch ? lastWordMatch[1] : null;

  // Check if in comment
  const linePos = context.pos - line.from;
  const commentIndex = line.text.indexOf("#");

  return {
    prevWord,
    inComment: commentIndex !== -1 && linePos >= commentIndex,
  };
}

function getVariableCompletion(variable: VariableDeclaration) {
  let usage = `${variable.line} var ${variable.name}`;
  if (variable.isArray) {
    usage += "[]";
  }
  const varOrArray = variable.isArray ? "array" : "variable";
  const description = `Previously declared ${varOrArray} "${variable.name}"`;
  return {
    label: variable.name,
    type: "variable",
    info: () => getCompletionNode({ usage, description }),
  };
}

function getCompletion(instruction: string) {
  const doc =
    INSTRUCTION_DOCUMENTATIONS[
      instruction as keyof typeof INSTRUCTION_DOCUMENTATIONS
    ] ?? getDefaultDocumentation(instruction);
  return {
    label: instruction,
    type: "keyword",
    // Styling handled in codemirror.css
    info: () => getCompletionNode(doc),
  };
}

function getCompletionNode(doc: Documentation) {
  const docs = Array.isArray(doc) ? doc : [doc];
  const container = document.createElement("div");
  container.className = "documentation";
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    container.appendChild(getUsageElement(doc.usage));
    container.appendChild(getTextElement(doc.description, "description"));
    if (doc.warning) {
      container.appendChild(getTextElement(doc.warning, "warning"));
    }
    // Add separator
    if (i < docs.length - 1) {
      const separator = document.createElement("div");
      separator.className = "separator";
      container.appendChild(separator);
    }
  }
  return container;
}

function getUsageElement(code: string) {
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
    code,
    docLanguage.parser.parse(code),
    classHighlighter,
    putText,
    putBreak,
  );

  return usage;
}

function getTextElement(text: string, className: string) {
  const elem = document.createElement("div");
  elem.className = className;

  const parts = text.split(/(".*?")/g);
  for (const part of parts) {
    if (part.startsWith('"') && part.endsWith('"')) {
      const span = document.createElement("span");
      span.className = "quoted";
      span.textContent = part.slice(1, -1);
      elem.appendChild(span);
    } else {
      elem.appendChild(document.createTextNode(part));
    }
  }

  return elem;
}

function getDefaultDocumentation(instruction: string): SingleDocumentation {
  return {
    usage: instruction,
    description: `Instruction "${instruction}"`,
  };
}

export const amazeingAutocomplete = autocompletion({
  override: [amazeingCompletions],
});
