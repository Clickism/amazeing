import {
  prettifyToken,
  prettifyTokenType,
  type Token,
  type TokenType,
} from "./token.ts";
import type {
  Instruction,
  InstructionData,
  InstructionType,
} from "../instruction.ts";
import type { LabelMap } from "../environment.ts";
import type { LabelDeclaration } from "../../amazeing/autocomplete/state.ts";
import {
  type Address,
  type ArrayIndex,
  type Direction,
  isDirection,
  type LeftRight,
  type Value,
} from "../types.ts";
import { LocatableError } from "../error.ts";

export type ParsingResult = {
  instructions: InstructionData[];
  labels: LabelMap;
};

/**
 * Parser class
 */
export class Parser {
  private pos: number = 0;
  private line: number = 1;
  private readonly tokens: Token[];

  private instructions: InstructionData[] = [];
  private labels: LabelMap = new Map();

  private currentlyParsing: InstructionType | null = null;

  /**
   * Creates a new parser instance
   * @param tokens tokens to parse
   */
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  /**
   * Parses the code
   */
  parse(): ParsingResult {
    // Parsing loop
    while (this.peek() !== null) {
      this.parseLine();
    }

    // Return result
    const { instructions, labels } = this;
    return { instructions, labels };
  }

  parseLine() {
    // Pop newline
    if (this.peekType("newline")) {
      this.pop();
      this.line++;
      return;
    }

    // End of input
    if (this.peek() === null) {
      return;
    }

    // Label definition
    if (this.peekType("identifier") && this.peekType("colon", 1)) {
      const { label } = this.parseLabel();
      // Set the pc to the next instruction to be added
      this.labels.set(label, { label, pc: this.instructions.length });
      return;
    }

    // Instruction
    if (this.peekType("identifier")) {
      const instruction = this.parseInstruction();
      this.instructions.push({
        instruction,
        line: this.line,
      });
      return;
    }

    this.error(
      `Unexpected token of type ${this.peek()!.type} at start of line`,
    );
  }

  parseLabel(): LabelDeclaration {
    const identifierToken = this.popTypeOrThrow("identifier");
    this.popTypeOrThrow("colon"); // Colon
    const label = identifierToken.value;
    if (this.labels.has(label)) {
      this.error(`Label "${label}" already defined`);
    }
    return { label, line: this.line };
  }

  parseInstruction(): Instruction {
    const type = this.popTypeOrThrow("identifier").value as InstructionType;
    this.currentlyParsing = type;
    const instruction = this.parseInstructionInternal(type);
    this.assertLineEnd();
    this.currentlyParsing = null;
    return instruction;
  }

  parseInstructionInternal(type: InstructionType): Instruction {
    switch (type) {
      // No var instructions
      case "move":
      case "ret":
      case "exit": {
        return { type };
      }
      // One var instructions
      case "print":
      case "debug":
      case "getdir":
      case "getmark": {
        return { type, src: this.parseAddress() };
      }
      // Two var instructions
      case "explore": {
        const dest = this.parseAddress();
        const direction = this.hasTokensInLine()
          ? this.parseDirection()
          : undefined;
        return { type, dest, direction };
      }
      case "copy":
      case "not": {
        const dest = this.parseAddress();
        const src = this.parseAddress();
        return {
          type,
          dest,
          src,
        };
      }
      // Three var (intermediate) instructions
      case "add":
      case "sub":
      case "mul":
      case "div":
      case "and":
      case "or":
      case "xor":
      case "lt":
      case "lte":
      case "gt":
      case "gte":
      case "eq":
      case "neq":
      case "sll":
      case "srl":
      case "sra": {
        const dest = this.parseAddress();
        const src1 = this.parseAddress();
        const src2 = this.parseAddressOrValue();
        return {
          type,
          dest,
          src1,
          src2,
        };
      }
      // Control flow instructions
      case "jump":
      case "call": {
        const target = this.popTypeOrThrow("identifier").value;
        return { type, target };
      }
      case "branch":
      case "branchz": {
        const cond = this.parseAddress();
        const target = this.popArgument("identifier", "label").value;
        return {
          type,
          cond,
          target,
        };
      }
      // Other instructions
      case "turn": {
        const direction = this.parseLeftRight();
        return { type: "turn", direction };
      }

      case "var": {
        const name = this.popTypeOrThrow("identifier").value;
        let isArray = false;
        if (this.peekType("lbracket")) {
          this.pop(); // [
          if (!this.peekType("rbracket")) {
            this.error(`Unclosed bracket: "${name}["`);
          }
          this.popTypeOrThrow("rbracket"); // ]
          isArray = true;
        }
        return { type: "var", name, isArray };
      }
      case "load": {
        const dest = this.parseAddress();
        const value = this.parseValue();
        return {
          type: "load",
          dest,
          value,
        };
      }
      // Mark
      case "mark":
      case "unmark": {
        const direction = this.hasTokensInLine()
          ? this.parseDirection()
          : undefined;
        return { type, direction };
      }
      case "printascii": {
        const src = this.hasTokensInLine() ? this.parseAddress() : undefined;
        return { type, src };
      }
      default: {
        this.error(`Unknown instruction: "${type}"`);
      }
    }
  }

  parseAddress(): Address {
    const name = this.popArgument("identifier", "address").value;
    if (this.peekType("lbracket")) {
      // Array access
      this.pop(); // [
      let index: ArrayIndex;
      if (this.peekType("number")) {
        index = this.popTypeOrThrow("number").value;
      } else if (this.peekType("identifier")) {
        index = this.popTypeOrThrow("identifier").value;
      } else if (this.peekType("rbracket")) {
        this.error(`Expected a numeric index or a variable index`);
      } else {
        this.error(`Unclosed bracket for array access`);
      }
      this.popTypeOrThrow("rbracket"); // [
      return { array: name, index };
    }
    return name;
  }

  parseDirection(): Direction {
    const value = this.popArgument("identifier", "direction").value;
    if (isDirection(value)) {
      return value;
    }
    this.error(`Invalid direction: "${value}"`);
  }

  parseLeftRight(): LeftRight {
    const value = this.popArgument("identifier", "left_right").value;
    if (value !== "left" && value !== "right") {
      this.error(`Invalid direction: "${value}", must be "left" or "right"`);
    }
    return value;
  }

  parseValue(): Value {
    const token = this.peek();
    if (isEmptyToken(token)) {
      this.error(`Expected a value`);
    }
    if (token.type === "identifier") {
      // Direction
      if (isDirection(token.value)) {
        return this.parseDirection();
      }
      this.error(`Invalid value: "${token.value}"`);
    }
    if (token.type === "char") {
      // Character literal
      return this.popTypeOrThrow("char").value;
    }
    // Number
    if (token.type === "number") {
      return this.popTypeOrThrow("number").value;
    }

    // Error
    if (this.currentlyParsing) {
      this.error(`Expected a value for instruction "${this.currentlyParsing}"`);
    }
    this.error(`Expected a value`);
  }

  parseAddressOrValue(): Address | Value {
    const token = this.peek();
    if (isEmptyToken(token)) {
      if (this.currentlyParsing) {
        this.error(
          `Expected an address or value for instruction "${this.currentlyParsing}"`,
        );
      }
      this.error(`Expected an address or value`);
    }
    if (token.type === "identifier" && !isDirection(token.value)) {
      // Address
      return this.parseAddress();
    }
    // Parse value
    return this.parseValue();
  }

  /**
   * Peeks the next token without consuming it
   * @param offset offset to position (default 0 for next token)
   * @returns the next token or null if no more tokens
   */
  private peek(offset = 0): Token | null {
    const index = this.pos + offset;
    if (index >= this.tokens.length) {
      return null;
    }
    return this.tokens[index];
  }

  /**
   * Checks that there are at least "count" many tokens in this line
   * @param count token count to check
   */
  private hasTokensInLine(count = 1): boolean {
    for (let i = 0; i < count; ++i) {
      const token = this.peek(i);
      if (isEmptyToken(token)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Peeks the next token and checks if it is of the given type
   * @param type type to check
   * @param offset offset to position (default 0 for next token)
   */
  private peekType(type: TokenType, offset = 0): boolean {
    const token = this.peek(offset);
    return token !== null && token.type === type;
  }

  /**
   * Pops the next token
   */
  private pop(): Token | null {
    const token = this.peek();
    this.pos++;
    return token;
  }

  /**
   * Behaves the same as {@link popTypeOrThrow} but has error messages
   * for a missing argument
   * @param type type of token to assert
   * @param expected expected type of the argument
   */
  private popArgument<T extends TokenType>(type: T, expected: string) {
    const token = this.peek();
    if (expected === undefined) {
      expected = prettifyTokenType(type);
    }
    if (isEmptyToken(token)) {
      if (this.currentlyParsing !== null) {
        this.error(
          `Expected argument of type ${expected} for instruction "${this.currentlyParsing}"`,
        );
      }
      this.error(`Expected argument of type ${expected}`);
    }
    return this.popTypeOrThrow(type);
  }

  /**
   * Pops the next token and checks that it is of the given type, if not, throws an error
   * @param type type of token to assert
   */
  private popTypeOrThrow<T extends TokenType>(
    type: T,
  ): Extract<Token, { type: T }> {
    const token = this.pop();
    if (isEmptyToken(token)) {
      if (this.currentlyParsing !== null) {
        this.error(
          `Expected token of type ${prettifyTokenType(type)} when parsing instruction "${this.currentlyParsing}"`,
        );
      }
      this.error(
        `Unexpected end of input, expected token of type ${prettifyTokenType(type)}`,
      );
    }
    if (token.type === type) {
      return token as Extract<Token, { type: T }>;
    }
    this.error(
      `Unexpected token of type ${prettifyToken(token)}, expected ${prettifyTokenType(type)}`,
    );
  }

  /**
   * Checks that the next token is a newline,
   * if not, throws an error saying wrong number of arguments
   */
  private assertLineEnd() {
    if (this.peekType("newline") || this.peek() === null) return;
    if (this.currentlyParsing !== null) {
      this.error(
        `Too many argument(s) for instruction of type "${this.currentlyParsing}"`,
      );
    }
    this.error(`Unexpected tokens at the end of line!`);
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

/**
 * Checks if a token is null or a newline
 */
function isEmptyToken(token: Token | null): token is null {
  return token === null || token.type === "newline";
}
