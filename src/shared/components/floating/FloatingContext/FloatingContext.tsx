import { createContext, useContext } from "react";

type FloatingContext = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const FloatingContext = createContext<FloatingContext | null>(null);

export function useFloatingContext() {
  const context = useContext(FloatingContext);
  if (!context) {
    throw new Error(
      "useFloatingContext must be used within a FloatingContext.Provider",
    );
  }
  return context;
}
