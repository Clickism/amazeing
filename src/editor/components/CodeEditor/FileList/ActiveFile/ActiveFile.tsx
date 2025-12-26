import clsx from "clsx";
import styles from "./ActiveFile.module.css";
import { Button } from "../../../../../components/Button/Button.tsx";

export function ActiveFile({ activeFile }: { activeFile: string }) {
  return (
    <Button variant="secondary" className={clsx(styles.activeFile)}>
      {activeFile}
    </Button>
  );
}
