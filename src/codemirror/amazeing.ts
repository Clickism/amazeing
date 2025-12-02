import { StreamLanguage } from "@codemirror/language";
import { ALL_INSTRUCTIONS } from "../interpreter/instruction.ts";

export const keywordPattern = new RegExp(`\\b(${ALL_INSTRUCTIONS.join("|")})\\b`);

export const amazeing = StreamLanguage.define({
  startState() {
    return { afterVar: false };
  },
  token(stream, state) {
    if (stream.eatSpace()) return null;
    if (stream.match(/#.*/)) return "comment";
    if (state.afterVar && stream.match(/\w+/)) {
      state.afterVar = false; // reset
      return "variableName.definition";
    }
    // TODO: Keywords in identifiers get highlighted
    if (stream.match(keywordPattern)) {
      state.afterVar = stream.current() === "var";
      return "keyword";
    }
    if (stream.match(/\barg\d+/)) return "string";
    if (stream.match(/\b\d+\b/)) return "number";
    if (stream.match(/\b\w+:/)) return "variableName.function";
    if (stream.match(/[=+\-*/:[\]]/)) return "operator";
    stream.next();
    return null;
  },
});
