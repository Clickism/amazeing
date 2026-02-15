import {
  autocompletion,
  type Completion,
  CompletionContext,
} from "@codemirror/autocomplete";
import { ALL_INSTRUCTIONS } from "../../interpreter/instruction.ts";
import {
  type ArgumentType,
  getInstructionArguments,
} from "../documentation/arguments.ts";
import { type CompletionState, extractCompletionState } from "./state.ts";
import {
  getDirectionCompletion,
  getInstructionCompletion,
  getLabelCompletion,
  getVariableCompletion,
} from "./completions.ts";
import type {
  CardinalDirection,
  Direction,
  LeftRight,
  RelativeDirection,
} from "../../interpreter/types.ts";

export const amazeingAutocomplete = autocompletion({
  override: [amazeingCompletions],
});

function amazeingCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (!word) return null;
  const state = extractCompletionState(context);
  if (!state) return null;
  // Don't autocomplete if naming variable or in comment
  if (state.inComment) {
    return null;
  }

  // Check if completing an argument
  if (state.argIndex !== null && state.instruction !== null) {
    const argument = getInstructionArguments(state.instruction)?.[
      state.argIndex
    ];
    if (argument) {
      return {
        from: word.from,
        options: argument.types
          .map((arg) => getCompletionsFor(arg, state))
          .flat(),
      };
    }
  }

  if (word.from === word.to && !context.explicit) return null;

  // Suggest all instructions
  return {
    from: word.from,
    options: [...ALL_INSTRUCTIONS.map(getInstructionCompletion)],
  };
}

const LEFT_RIGHT: LeftRight[] = ["left", "right"];
const RELATIVE_DIRECTIONS: RelativeDirection[] = [
  ...LEFT_RIGHT,
  "front",
  "back",
  "here",
];
const CARDINAL_DIRECTIONS: CardinalDirection[] = [
  "north",
  "east",
  "south",
  "west",
];
const DIRECTIONS: Direction[] = [
  ...CARDINAL_DIRECTIONS,
  ...RELATIVE_DIRECTIONS,
];

function getCompletionsFor(
  argument: ArgumentType,
  state: CompletionState,
): Completion[] {
  switch (argument) {
    case "address":
    case "variable":
      return state.variables.map(getVariableCompletion);
    case "label":
      return state.labels.map(getLabelCompletion);
    case "integer":
    case "identifier":
      return [];
    case "direction":
      return DIRECTIONS.map(getDirectionCompletion);
    case "cardinal_direction":
      return CARDINAL_DIRECTIONS.map(getDirectionCompletion);
    case "relative_direction":
      return RELATIVE_DIRECTIONS.map(getDirectionCompletion);
    case "left_right":
      return LEFT_RIGHT.map(getDirectionCompletion);
  }
}
