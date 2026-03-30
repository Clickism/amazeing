import type { Token } from "./token.ts";
import { LocatableError } from "../error.ts";

/**
 * Escape character lookup
 */
const ESCAPES: Record<string, string> = {
  n: "\n",
  t: "\t",
  "'": "'",
  "\\": "\\",
  "0": "\0",
};

/**
 * Lexer class
 */
export class Lexer {
  private pos = 0;
  private line = 1;
  private readonly input: string;

  /**
   * Creates a new lexer instance
   * @param input input to tokenize
   */
  constructor(input: string) {
    this.input = input;
  }

  /**
   * Tokenizes the input and returns an array of tokens.
   * @throws {LocatableError} If an error occurs during tokenization.
   */
  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.pos < this.input.length) {
      const nextToken = this.nextToken();
      if (nextToken === null) break;
      if (nextToken.type === "newline") {
        this.line++;
      }
      tokens.push(nextToken);
    }
    return tokens;
  }

  /**
   * Lexes the next token or null if no more tokens
   */
  private nextToken(): Token | null {
    while (true) {
      const c = this.peek();
      if (c === null) return null;

      // Newline
      if (c === "\n") {
        this.pop();
        return { type: "newline" };
      }

      // Whitespace
      if (isWhitespace(c)) {
        this.pop();
        continue;
      }

      // Comment
      if (c === "#") {
        // Skip until newline or end of input
        while (this.peek() !== "\n" && this.peek() !== null) {
          this.pop();
        }
        continue;
      }

      // Identifier
      // Allow predefined vars to start with $
      if (isAlpha(c) || c === "$") {
        return this.readIdentifier();
      }

      // Negative number
      if (c === "-") {
        const nextChar = this.peek(1);
        if (nextChar && isDigit(nextChar)) {
          this.pop();
          return this.readNumber(true);
        }
      }

      // Number
      if (isDigit(c)) {
        return this.readNumber();
      }

      // Character Literal
      if (c === "'") {
        return this.readChar();
      }

      // String literal
      if (c === '"') {
        return this.readString();
      }

      // Symbols
      switch (c) {
        case ":":
          this.pop();
          return { type: "colon" };
        case "[":
          this.pop();
          return { type: "lbracket" };
        case "]":
          this.pop();
          return { type: "rbracket" };
      }

      this.error(
        `Unexpected character: ${c}`,
        `Valid tokens are identifiers, numbers, '[', ']', ':' or character literals`,
      );
    }
  }

  private readIdentifier(): Token {
    let value = this.pop()!;
    while (this.peek() != null && isAlphaNumeric(this.peek()!)) {
      value += this.pop();
    }
    return { type: "identifier", value };
  }

  private readNumber(isNegative = false): Token {
    let value = "";
    while (this.peek() != null && isDigit(this.peek()!)) {
      value += this.pop();
    }
    return { type: "number", value: Number(value) * (isNegative ? -1 : 1) };
  }

  private readChar(): Token {
    this.pop(); // '
    let c = this.peek();
    if (c === null) {
      this.error(`Unterminated character literal`, `Missing closing '`);
    }
    if (c === "\\") {
      c = this.readEscapeSequence();
    } else {
      this.pop(); // Character
    }
    if (this.peek() !== "'") {
      this.error(
        `Invalid character literal`,
        `Character literals must contain exactly one character, e.g. 'a' or '\\n'`,
      );
    }
    this.pop(); // Closing '
    return { type: "char", value: c.charCodeAt(0) };
  }

  private readEscapeSequence(): string {
    this.pop(); // \
    const c = this.pop();
    if (c === null || !(c in ESCAPES)) {
      this.error(
        `Invalid escaped sequence: \\${c ?? ""}`,
        `Supported escape sequences are ` +
          Object.keys(ESCAPES)
            .map((e) => `'\\${e}'`)
            .join(", "),
      );
    }
    return ESCAPES[c];
  }

  private readString(): Token {
    this.pop(); // "
    let value = "";
    while (true) {
      const c = this.peek();
      if (c === null) {
        this.error(`Unterminated string literal`, `Missing closing "`);
      }
      if (c === '"') {
        // Closing quote
        this.pop();
        break;
      }
      if (c === "\\") {
        // Escape char
        value += this.readEscapeSequence();
      }
      // Regular char
      value += this.pop();
    }
    return { type: "string", value: value };
  }

  /**
   * Peeks into the input with a given offset
   * @param offset
   */
  private peek(offset = 0): string | null {
    const index = this.pos + offset;
    if (index >= this.input.length) {
      return null;
    }
    return this.input[index];
  }

  /**
   * Pops the next character and advances the input by offset
   * @param offset
   */
  private pop(offset = 1): string | null {
    const c = this.peek();
    this.pos += offset;
    return c;
  }

  /**
   * Throws an error
   */
  private error(message: string, tip?: string): never {
    if (tip !== undefined) {
      throw new LocatableError(this.line, message, tip);
    }
    throw new LocatableError(this.line, message);
  }
}

function isAlpha(c: string) {
  return /[a-zA-Z_]/.test(c);
}

function isAlphaNumeric(c: string) {
  return /[a-zA-Z0-9_]/.test(c);
}

function isDigit(c: string) {
  return /[0-9]/.test(c);
}

function isWhitespace(c: string) {
  return /\s/.test(c);
}
