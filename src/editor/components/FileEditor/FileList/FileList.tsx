import { useSource } from "../../../source/SourceContext.tsx";
import clsx from "clsx";
import styles from "./FileList.module.css";
import { motion } from "motion/react";

export function FileList() {
  const { sourceNames, name: activeName, switchSource } = useSource();
  return (
    <div className={clsx(styles.container, "window-border")}>
      <div className={clsx(styles.fileContainer)}>
        {sourceNames?.map((name) => (
          <div
            key={name}
            className={clsx(styles.file, name === activeName && styles.active)}
            onClick={() => {
              switchSource?.(name);
            }}
          >
            {name === activeName && (
              <motion.div
                layoutId="file-list-indicator"
                className={styles.indicator}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 50,
                }}
              />
            )}
            <div className={styles.fileName}>
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
