import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { CodeEditorSettings } from "./CodeEditorSettings/CodeEditorSettings.tsx";
import { Fragment, type ReactNode } from "react";
import styles from "./TopBar.module.css";
import clsx from "clsx";
import { CodeFormat } from "./CodeFormat/CodeFormat.tsx";

export type TopBarProps = {
  title?: string;
  left?: ReactNode[];
  right?: ReactNode[];
  settingsButton?: boolean;
  formatButton?: boolean;
};

export function TopBar({ title, left, right, settingsButton, formatButton }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        {title && (
          <Button variant="secondary" className={clsx(styles.title)}>
            <span>{title}</span>
          </Button>
        )}
        {left?.map((item, i) => (
          <Fragment key={i}>{item}</Fragment>
        ))}
      </div>
      <div className={styles.right}>
        {right?.map((item, i) => (
          <Fragment key={i}>{item}</Fragment>
        ))}
      </div>
      {formatButton && <CodeFormat />}
      {settingsButton && <CodeEditorSettings />}
    </div>
  );
}
