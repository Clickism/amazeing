import { createContext, useContext } from "react";

export type SourceTypeContextType = {
  isMultiSource: boolean;
};

export const SourceTypeContext = createContext<SourceTypeContextType | null>(
  null,
);

export function useSourceType() {
  const ctx = useContext(SourceTypeContext);
  if (!ctx) {
    throw new Error("useSourceType must be provided");
  }
  return ctx;
}
