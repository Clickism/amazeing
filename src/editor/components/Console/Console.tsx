import styles from "./Console.module.css";
import clsx from "clsx";
import type { ConsoleMessage } from "../../../interpreter/console.ts";
import { useEffect, useRef } from "react";
import { CornerGroup } from "../../../components/CornerGroup/CornerGroup.tsx";
import { useTranslation } from "react-i18next";
import { useCodeEditorSettings } from "../../settings/CodeEditorSettingsContext.tsx";

export function Console({ messages }: { messages: ConsoleMessage[] }) {
  const { t } = useTranslation();
  const { settings } = useCodeEditorSettings();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={clsx(styles.console, "window-border")}>
      <CornerGroup className={styles.title}>{t("console.title")}</CornerGroup>
      <div className={styles.messageContainer} ref={containerRef}>
        {messages.map((message, i) => (
          <div
            key={i}
            className={clsx(styles.message, styles[`message-${message.type}`])}
            style={{
              fontSize: settings.fontSize,
            }}
          >
            {message.text}
          </div>
        ))}
      </div>
    </div>
  );
}
