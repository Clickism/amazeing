import type { ReactNode } from "react";
import Popup from "reactjs-popup";
import { FaInfoCircle } from "react-icons/fa";
import styles from "./FormField.module.css";

type Props = {
  label: string | ReactNode;
  htmlFor?: string;
  description?: string | ReactNode;
  children: ReactNode;
};

export function FormField({ label, htmlFor, description, children }: Props) {
  return (
    <div className={styles.formField}>
      <label htmlFor={htmlFor} className={styles.formLabel}>
        {label}
      </label>
      {description && (
        <Popup
          trigger={
            <div className={styles.infoIcon}>
              <FaInfoCircle />
            </div>
          }
          on={["hover", "click"]}
        >
          <div className={styles.descriptionPopup}>{description}</div>
        </Popup>
      )}
      <div className={styles.formInput}>{children}</div>
    </div>
  );
}
