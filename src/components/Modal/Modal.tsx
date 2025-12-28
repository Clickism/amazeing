import Popup from "reactjs-popup";
import type { PopupProps } from "reactjs-popup/dist/types";
import type { ReactNode } from "react";
import { Button } from "../Button/Button.tsx";
import styles from "./Modal.module.css";
import { CornerGroup } from "../CornerGroup/CornerGroup.tsx";
import { IoClose } from "react-icons/io5";

type ModalProps = {
  title?: string;
  closeButton?: boolean;
} & PopupProps;

export function Modal({
  closeButton = true,
  title,
  children,
  ...props
}: ModalProps) {
  return (
    <Popup
      modal
      closeOnDocumentClick
      contentStyle={{ borderRadius: "1rem" }}
      {...props}
    >
      {
        ((close: () => void) => (
          <div className={styles.body}>
            {title && <div className={styles.title}>{title}</div>}
            {children}
            <CornerGroup>
              {closeButton && (
                <Button shape="icon" onClick={close}>
                  <IoClose size={20} />
                </Button>
              )}
            </CornerGroup>
          </div>
        )) as unknown as ReactNode
      }
    </Popup>
  );
}
