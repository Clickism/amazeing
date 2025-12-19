import Popup from "reactjs-popup";
import type { PopupProps } from "reactjs-popup/dist/types";
import type { ReactNode } from "react";
import { Button } from "../Button/Button.tsx";
import styles from "./Modal.module.css";

type ModalProps = {
  closeButton?: boolean;
} & PopupProps;

export function Modal({ closeButton = true, children, ...props }: ModalProps) {
  return (
    <Popup modal closeOnDocumentClick {...props}>
      {
        ((close: () => void) => (
          <div className={styles.body}>
            {children}
            {closeButton && <Button onClick={close}>Close</Button>}
          </div>
        )) as unknown as ReactNode
      }
    </Popup>
  );
}
