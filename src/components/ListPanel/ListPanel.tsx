import clsx from "clsx";
import styles from "./ListPanel.module.css";
import { motion } from "motion/react";
import { type ReactNode, useRef } from "react";
import { CornerGroup } from "../CornerGroup/CornerGroup.tsx";
import { ButtonGroup } from "../Button/ButtonGroup/ButtonGroup.tsx";

type ListPanelProps = {
  elements: string[];
  activeElement: string | null;
  onSelectElement?: (name: string) => void;
  children?: ReactNode | ReactNode[];
  layoutId?: string;
};

export function ListPanel({
  elements,
  activeElement,
  onSelectElement,
  layoutId = "list-indicator",
  children,
}: ListPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  return (
    <div className={clsx(styles.container, "window-border")}>
      <div className={clsx(styles.list)} ref={listRef}>
        {elements.map((name) => (
          <div
            key={name}
            className={clsx(
              styles.element,
              name === activeElement && styles.active,
            )}
            onClick={() => {
              onSelectElement?.(name);
            }}
          >
            {name === activeElement && (
              <motion.div
                layoutId={layoutId}
                className={styles.indicator}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 50,
                }}
              />
            )}
            <div className={styles.elementName}>{name}</div>
          </div>
        ))}
        <div className={styles.spacer} />
      </div>
      {children && (
        <CornerGroup position="bottom-left" className={styles.cornerGroup}>
          <ButtonGroup stretch>{children}</ButtonGroup>
        </CornerGroup>
      )}
    </div>
  );
}
