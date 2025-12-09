import { StreamLanguage } from "@codemirror/language";
import { ALL_CONSTANTS, ALL_INSTRUCTIONS } from "../interpreter/instruction.ts";

export const keywordPattern = new RegExp(
  `\\b(${ALL_INSTRUCTIONS.join("|")})\\b`,
);
export const constantPattern = new RegExp(`\\b(${ALL_CONSTANTS.join("|")})\\b`);

export const amazeing = StreamLanguage.define({
  startState() {
    return { isDefinition: false };
  },
  token(stream, state) {
    if (stream.eatSpace()) return null;
    if (stream.match(/#.*/)) return "comment";
    if (stream.match(/\b\w+:/)) return "variableName.function";
    // Match word
    if (stream.match(/^\w+/)) {
      const word = stream.current();
      if (state.isDefinition) {
        state.isDefinition = false;
        return "variableName.definition";
      }
      if (keywordPattern.test(word)) {
        state.isDefinition = word === "var";
        return "keyword";
      }
      if (/^arg\d+$/.test(word)) return "string";
      if (/^\d+$/.test(word)) return "number";
      if (constantPattern.test(word)) return "number";
      return null;
    }
    // Operators
    if (stream.match(/[=+\-*/:[\]]/)) return "operator";
    stream.next();
    return null;
  },
});
