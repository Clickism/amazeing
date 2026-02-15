import { getInstructionDocumentation } from "../documentation/documentation.ts";
import type { LabelDeclaration, VariableDeclaration } from "./state.ts";
import { getCompletionNode } from "./view.ts";
import type { Completion } from "@codemirror/autocomplete";
import type { Direction } from "../../interpreter/types.ts";

export function getDirectionCompletion(direction: Direction): Completion {
  return {
    label: direction,
    type: "keyword",
    info: () =>
      getCompletionNode({
        usage: direction,
        description: `Direction "${direction}."`,
      }),
  };
}

export function getInstructionCompletion(instruction: string): Completion {
  const doc = getInstructionDocumentation(instruction) ?? {
    usage: instruction,
    description: `Instruction "${instruction}."`,
  };
  return {
    label: instruction,
    type: "keyword",
    info: () => getCompletionNode(doc),
  };
}

export function getVariableCompletion(
  variable: VariableDeclaration,
): Completion {
  let usage = `${variable.line} var ${variable.name}`;
  if (variable.isArray) {
    usage += "[]";
  }
  const varOrArray = variable.isArray ? "array" : "variable";
  const description = `Previously declared ${varOrArray} "${variable.name}".`;
  return {
    label: variable.name,
    type: "variable",
    info: () => getCompletionNode({ usage, description }),
  };
}

export function getLabelCompletion(label: LabelDeclaration): Completion {
  const usage = `${label.line} ${label.label}:`;
  const description = `Label "${label.label}".`;
  return {
    label: label.label,
    type: "function",
    info: () => getCompletionNode({ usage, description }),
  };
}
