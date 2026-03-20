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
