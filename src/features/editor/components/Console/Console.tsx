import styles from "./Console.module.css";
import clsx from "clsx";
import type { ConsoleMessage } from "../../../../core/interpreter/console.ts";
import { useEffect, useRef } from "react";
import { CornerGroup } from "../../../../shared/components/CornerGroup/CornerGroup.tsx";
import { useTranslation } from "react-i18next";
import { useCodeEditorSettings } from "../../settings/CodeEditorSettingsContext.tsx";
import { AnimatePresence, motion } from "motion/react";
import { useEditorSettings } from "../../settings/EditorSettingsContext.tsx";
import { useEditorRuntime } from "../../runtime/EditorRuntimeContext.tsx";

export function Console({ messages }: { messages: ConsoleMessage[] }) {
  const { t } = useTranslation();
  const {
    settings: { fontSize },
  } = useCodeEditorSettings();
  const {
    settings: { isInstant },
  } = useEditorSettings();
  const { isRunning } = useEditorRuntime();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const shouldAnimate = !isRunning || !isInstant;

  return (
    <div className={clsx(styles.console)}>
      <CornerGroup className={styles.title}>{t("console.title")}</CornerGroup>
      <div className={styles.messageContainer} ref={containerRef}>
        {messages.map((message, i) => (
          <AnimatePresence key={i}>
            <motion.div
              className={clsx(
                styles.message,
                styles[`message-${message.type}`],
              )}
              style={{ fontSize }}
              {...(shouldAnimate
                ? {
                    initial: { opacity: 0, y: 10, filter: "blur(8px)" },
                    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                    exit: { opacity: 0, y: -10, filter: "blur(8px)" },
                    transition: { duration: 0.25, ease: "easeOut" },
                  }
                : {})}
            >
              {message.text}
            </motion.div>
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
}
