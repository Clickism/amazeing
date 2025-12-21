import { StreamLanguage } from "@codemirror/language";
import { keywordPattern } from "../amazeing.ts";

// Styling handled in codemirror.css
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
    if (stream.match(/[a-zA-Z_0-9]*(?=.*>):/)) return "string";
    if (stream.match(/[a-zA-Z_0-9]*:/)) return "variableName.function";
    if (stream.match(/[a-zA-Z_0-9]/)) return "type";
    if (stream.match(/\?/)) return "escape";
    stream.next();
    return null;
  },
});
