type Tok<T extends string, V = undefined> = {
  type: T;
} & (V extends undefined ? object : { value: V });

/**
 * Token type
 */
export type Token =
  | Tok<"identifier", string>
  | Tok<"number", number>
  | Tok<"char", number>
  | Tok<"colon">
  | Tok<"lbracket">
  | Tok<"rbracket">
  | Tok<"newline">;

export type TokenType = Token["type"];

/**
 * Prettifies a token type for error messages
 */
export function prettifyTokenType(type: TokenType): string {
  switch (type) {
    case "lbracket":
      return "[";
    case "rbracket":
      return "]";
    case "colon":
      return ":";
    case "char":
      return "character literal";
    default:
      return type;
  }
}

/**
 * Prettifies a token for error messages
 */
export function prettifyToken(token: Token): string {
  const type = prettifyTokenType(token.type);
  if ("value" in token) {
    return type + ` (${token.value})`;
  }
  return type;
}
