import { Button } from "../../../../components/Button/Button.tsx";
import { CodeEditorSettings } from "./CodeEditorSettings/CodeEditorSettings.tsx";
import { type ReactNode } from "react";
import styles from "./TopBar.module.css";
import clsx from "clsx";

export type TopBarProps = {
  title?: string;
  leftContent?: ReactNode | ReactNode[];
  rightContent?: ReactNode | ReactNode[];
};

export function TopBar({ title, leftContent, rightContent }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      {title && (
        <Button variant="secondary" className={clsx(styles.title)}>
          {title}
        </Button>
      )}
      {leftContent}
      <div className={styles.separator} />
      {rightContent}
      <CodeEditorSettings />
    </div>
  );
}
