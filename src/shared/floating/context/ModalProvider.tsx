import { type PropsWithChildren, type ReactNode, useState } from "react";
import { Modal, type ModalProps } from "../components/Modal/Modal.tsx";
import { ModalContext } from "./ModalContext.tsx";

export function ModalProvider({ children }: PropsWithChildren) {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [props, setProps] = useState<Partial<ModalProps> | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <ModalContext.Provider
      value={{
        setProps,
        setContent,
        setOpen,
        isOpen: content !== null,
      }}
    >
      <Modal {...props} trigger={null} isOpen={open} setIsOpen={setOpen}>
        {content}
      </Modal>
      {children}
    </ModalContext.Provider>
  );
}
