import styles from "./Console.module.css";
import clsx from "clsx";
import type { ConsoleMessage } from "../../interpreter/console.ts";
import { useEffect, useRef } from "react";
import { CornerGroup } from "../ui/CornerGroup/CornerGroup.tsx";

export function Console({ messages }: { messages: ConsoleMessage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={clsx(styles.console, "window-border")} ref={containerRef}>
      <CornerGroup className={styles.title}>
        Console
      </CornerGroup>
      {messages.map((message, i) => (
        <div key={i} className={clsx(styles.message, styles[`message-${message.type}`])}>
          {message.text}
        </div>
      ))}
    </div>
  );
}
