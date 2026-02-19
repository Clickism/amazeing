import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { CodeEditorSettings } from "./CodeEditorSettings/CodeEditorSettings.tsx";
import { Fragment, type ReactNode } from "react";
import styles from "./TopBar.module.css";
import clsx from "clsx";

export type TopBarProps = {
  title?: string;
  left?: ReactNode[];
  right?: ReactNode[];
  settingsButton?: boolean;
};

export function TopBar({ title, left, right, settingsButton }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      {title && (
        <Button variant="secondary" className={clsx(styles.title)}>
          {title}
        </Button>
      )}
      {left?.map((item, i) => (
        <Fragment key={i}>{item}</Fragment>
      ))}
      <div className={styles.separator} />
      {right?.map((item, i) => (
        <Fragment key={i}>{item}</Fragment>
      ))}
      {settingsButton && <CodeEditorSettings />}
    </div>
  );
}
