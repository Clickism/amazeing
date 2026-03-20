import type { Token, TokenType } from "./token.ts";
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
  type Value,
} from "../types.ts";
import { ErrorWithTip, LocatableError } from "../error.ts";

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

  parse(): ParsingResult {
    while (this.peek() !== null) {
      try {
        this.parseLine();
        // Increment line counter
        this.line++;
      } catch (err) {
        // Add line number to error
        if (!(err instanceof Error)) throw err;
        if (err instanceof ErrorWithTip) {
          throw new LocatableError(this.line, err.message, err.tip);
        }
        throw new LocatableError(this.line, err.message);
      }
    }

    // Return result
    const { instructions, labels } = this;
    return { instructions, labels };
  }

  parseLine() {
    // Pop newline
    if (this.peekType("newline")) {
      this.pop();
      return;
    }

    // End of input
    if (this.peek() === null) {
      return;
    }

    // Label definition
    if (this.peekType("identifier") && this.peekType("colon", 1)) {
      const { label, line } = this.parseLabel();
      // Set the pc to next line
      this.labels.set(label, { label, pc: line + 1 });
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

    throw new Error(
      `Unexpected token of type ${this.peek()!.type} at start of line`,
    );
  }

  parseLabel(): LabelDeclaration {
    const identifierToken = this.popTypeOrThrow("identifier");
    this.popTypeOrThrow("colon"); // Colon
    const label = identifierToken.value;
    if (this.labels.has(label)) {
      const existing = this.labels.get(label)!;
      throw new Error(
        `Label "${label}" already defined on line ${existing.pc - 1}`,
      );
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
        const direction = this.hasMore() ? this.parseDirection() : undefined;
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
        const target = this.popTypeOrThrow("identifier").value;
        return {
          type,
          cond,
          target,
        };
      }
      // Other instructions
      case "turn": {
        const direction = this.parseDirection();
        if (direction !== "left" && direction !== "right") {
          throw new Error(
            `Invalid direction: "${direction}", must be "left" or "right"`,
          );
        }
        return { type: "turn", direction };
      }

      case "var": {
        const name = this.popTypeOrThrow("identifier").value;
        let isArray = false;
        if (this.peekType("lbracket")) {
          if (!this.peekType("rbracket", 1)) {
            throw new Error(`Unclosed bracket: "${name}["`);
          }
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
        const direction = this.hasMore() ? this.parseDirection() : undefined;
        return { type, direction };
      }
      case "printascii": {
        const src = this.hasMore() ? this.parseAddress() : undefined;
        return { type, src };
      }
      default:
        throw new Error(`Unknown instruction: "${type}"`);
    }
  }

  parseAddress(): Address {
    const name = this.popTypeOrThrow("identifier").value;
    if (this.peekType("lbracket")) {
      // Array access
      this.pop(); // [
      const index: ArrayIndex = this.peekType("number")
        ? // Numeric index
          this.popTypeOrThrow("number").value
        : // Variable index
          this.popTypeOrThrow("identifier").value;
      this.popTypeOrThrow("rbracket"); // [
      return { array: name, index };
    }
    return name;
  }

  parseDirection(): Direction {
    const token = this.popTypeOrThrow("identifier");
    if (isDirection(token)) {
      return token;
    }
    throw new Error(`Invalid direction: "${token}"`);
  }

  parseValue(): Value {
    const token = this.peek();
    if (token === null) {
      throw new Error(`Expected a value, but got end of line`);
    }
    if (token.type === "identifier") {
      // Direction
      return this.parseDirection();
    }
    // Number
    return this.popTypeOrThrow("number").value;
  }

  parseAddressOrValue(): Address | Value {
    const token = this.peek();
    if (token === null) {
      throw new Error(`Expected an address or value, but got end of line`);
    }
    if (token.type === "identifier") {
      // Direction value
      if (isDirection(token)) {
        return this.parseDirection();
      }
      // Address
      return this.parseAddress();
    }
    // Number value
    return this.popTypeOrThrow("number").value;
  }

  /**
   * Peeks the next token without consuming it
   * @param offset offset to position (default 0 for next token)
   * @returns the next token or null if no more tokens
   */
  private peek(offset = 0): Token | null {
    return this.tokens[this.pos + offset] ?? null;
  }

  /**
   * Checks that the next "count" tokens are not null or newlines.
   * @param count
   */
  private hasMore(count = 1): boolean {
    for (let i = 0; i < count; ++i) {
      const token = this.peek(i);
      if (token === null || token.type === "newline") {
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
    return this.tokens[this.pos++];
  }

  private popTypeOrThrow<T extends TokenType>(
    type: T,
  ): Extract<Token, { type: T }> {
    const token = this.pop();
    if (token === null) {
      if (this.currentlyParsing !== null) {
        throw new Error(
          `Expected more arguments for instruction of type ${this.currentlyParsing}`,
        );
      }
      throw new Error(
        `Unexpected end of input, expected token of type ${type}`,
      );
    }
    if (token.type === type) {
      return token as Extract<Token, { type: T }>;
    }
    throw new Error(`Unexpected token of type "${token.type}"`);
  }

  /**
   * Checks that the next token is a newline,
   * if not, throws an error saying wrong number of arguments
   */
  private assertLineEnd() {
    if (this.peekType("newline") || this.peek() === null) return;
    if (this.currentlyParsing !== null) {
      throw new Error(
        `Unexpected argument(s) for instruction of type "${this.currentlyParsing}"`,
      );
    }
    throw new Error(`Unexpected tokens at the end of line!`);
  }
}
