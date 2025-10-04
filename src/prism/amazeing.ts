import { Prism } from "prism-react-renderer";

Prism.languages.amazeing = {
  comment: /#.*/,
  keyword: /\b(move|turn|var|load|copy|add|sub|mul|div|and|or|xor|not|lt|lte|gt|gte|eq|neq|jump|call|ret|branch|branchz|print)\b/,
  string: /arg\d+/,
  number: /\b\d+\b/,
  function: /\b\w+(?=:)/,
  operator: /[=+\-*/:]/,
};
