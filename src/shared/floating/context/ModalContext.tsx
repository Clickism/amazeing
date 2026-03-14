import { createContext, type ReactNode, useContext } from "react";
import type { ModalProps } from "../components/Modal/Modal.tsx";

export type ModalContext = {
  setProps: (props: Partial<ModalProps>) => void;
  setContent: (content: ReactNode) => void;
  setOpen: (open: boolean) => void;
  isOpen: boolean;
};

export const ModalContext = createContext<ModalContext | null>(null);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
}
