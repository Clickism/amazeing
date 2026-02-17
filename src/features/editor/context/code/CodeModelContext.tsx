import type { MultiSource, Source } from "../source/source.ts";
import { createContext, useContext } from "react";

export type Code = string;

export type CodeModel = {
  /**
   * The current code. This is the code that is currently being edited.
   *
   * It is derived from the source, so it will be updated when the source changes.
   */
  code: Code;
  /**
   * Set the code. This will update the source as well.
   *
   * @param code The new code to set
   */
  setCode: (code: Code) => void;

  /**
   * The source of the code
   */
  source: Source<Code> | MultiSource<Code>;
};

export const CodeModelContext = createContext<CodeModel | null>(null);

/**
 * Hook to access the code model context.
 */
export function useCodeModel() {
  const context = useContext(CodeModelContext);
  if (!context) {
    throw new Error("useCodeModel must be used within a CodeModelProvider");
  }
  return context;
}
