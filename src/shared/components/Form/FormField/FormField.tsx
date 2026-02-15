import type { ReactNode } from "react";
import { FaInfoCircle } from "react-icons/fa";
import styles from "./FormField.module.css";
import { Tooltip } from "../../floating/Tooltip/Tooltip.tsx";

type Props = {
  label: string | ReactNode;
  unit?: string | ReactNode;
  unitWidth?: number;
  htmlFor?: string;
  description?: string | ReactNode;
  children: ReactNode;
};

export function FormField({
  label,
  unit,
  unitWidth,
  htmlFor,
  description,
  children,
}: Props) {
  return (
    <div className={styles.formField}>
      <label htmlFor={htmlFor} className={styles.formLabel}>
        {label}
        {unit &&
          (typeof unit === "string" ? (
            <div
              className={styles.unit}
              style={{
                minWidth: unitWidth ? `${unitWidth}px` : "auto",
              }}
            >
              ({unit})
            </div>
          ) : (
            unit
          ))}
      </label>
      {description && (
        <Tooltip content={description}>
          <div className={styles.infoIcon}>
            <FaInfoCircle />
          </div>
        </Tooltip>
      )}
      <div className={styles.formInput}>{children}</div>
    </div>
  );
}
