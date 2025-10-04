import { Prism } from "prism-react-renderer";

Prism.languages.amazeing = {
  comment: /#.*/,
  keyword: /\b(move|turn|var|load|copy|add|sub|mul|div|and|or|xor|not|lt|lte|gt|gte|eq|neq|jump|call|ret|branch|branchz|print)\b/,
  string: /"(?:\\.|[^\\"])*"/,
  number: /\b\d+\b/,
  function: /\b\w+(?=:)/,
  operator: /[=+\-*/]/,
};
