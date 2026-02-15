import { CompletionContext } from "@codemirror/autocomplete";

export type VariableDeclaration = {
  name: string;
  line: number;
  isArray: boolean;
};
export type LabelDeclaration = { label: string; line: number };

export type CompletionState = {
  instruction: string | null;
  argIndex: number | null;
  inComment: boolean;
  variables: VariableDeclaration[];
  labels: LabelDeclaration[];
};

export function extractCompletionState(
  context: CompletionContext,
): CompletionState | null {
  const word = context.matchBefore(/\w*/);
  if (!word) {
    return null;
  }
  const line = context.state.doc.lineAt(context.pos);
  const lineText = line.text.trim();
  const beforeWord = (
    word.text.length > 0 ? lineText.slice(0, -word.text.length) : lineText
  ).trimEnd();
  const parts = beforeWord.split(/\s+/);
  const argIndex = parts.length - 1;
  const instruction = parts[0] ?? null;

  // Check if in comment
  const linePos = context.pos - line.from;
  const commentIndex = line.text.indexOf("#");

  return {
    instruction,
    argIndex,
    inComment: commentIndex !== -1 && linePos >= commentIndex,
    variables: extractVariables(context),
    labels: extractLabels(context),
  };
}

function extractVariables(context: CompletionContext): VariableDeclaration[] {
  const variables: VariableDeclaration[] = [];
  const regex = /\bvar\s+([A-Za-z_][A-Za-z_0-9]*)(\[])?/;
  matchLines(context, regex, (match, lineNumber) => {
    variables.push({
      name: match[1],
      line: lineNumber + 1,
      isArray: match[2] !== undefined,
    });
  });
  return [...new Set(variables)]; // Remove duplicates
}

function extractLabels(context: CompletionContext): LabelDeclaration[] {
  const labels: LabelDeclaration[] = [];
  const regex = /^([A-Za-z_][A-Za-z_0-9]*):/;
  matchLines(context, regex, (match, lineNumber) => {
    labels.push({ label: match[1], line: lineNumber + 1 });
  });
  return [...new Set(labels)]; // Remove duplicates
}

function matchLines(
  context: CompletionContext,
  regex: RegExp,
  fn: (match: RegExpExecArray, lineNumber: number) => void,
) {
  const docText = context.state.doc.toString();
  const lines = docText.split("\n");
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    const currentLineNumber = context.state.doc.lineAt(context.pos).number;
    if (currentLineNumber === lineNumber + 1) {
      continue;
    }
    const line = lines[lineNumber];
    const match = regex.exec(line);
    if (match) {
      fn(match, lineNumber);
    }
  }
}
