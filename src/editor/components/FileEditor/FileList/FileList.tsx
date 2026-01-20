import { useSource } from "../../../source/SourceContext.tsx";
import clsx from "clsx";
import styles from "./FileList.module.css";
import { motion } from "motion/react";
import { Button } from "../../../../components/Button/Button.tsx";
import { CornerGroup } from "../../../../components/CornerGroup/CornerGroup.tsx";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

export function FileList() {
  const { t } = useTranslation();
  const {
    sourceNames,
    name: activeName,
    switchSource,
    newSource,
  } = useSource();
  const fileContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div className={clsx(styles.container, "window-border")}>
      <div className={clsx(styles.fileContainer)} ref={fileContainerRef}>
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
            <div className={styles.fileName}>{name}</div>
          </div>
        ))}
        <div className={styles.spacer} />
      </div>
      <CornerGroup position="bottom-left" className={styles.cornerGroup}>
        <ButtonGroup stretch>
          <Button
            onClick={() => {
              newSource?.();
              const container = fileContainerRef.current;
              if (!container) return;
              container.scrollTop = container.scrollHeight;
            }}
          >
            + {t("fileList.newFile")}
          </Button>
        </ButtonGroup>
      </CornerGroup>
    </div>
  );
}
