import { useContext } from "react";
import { CodeStorageContext } from "../context/CodeStorageContext.tsx";

export function useCodeStorage() {
  const ctx = useContext(CodeStorageContext);
  if (!ctx)
    throw new Error("useCodeStorage must be used within CodeStorageProvider");
  return ctx;
}
