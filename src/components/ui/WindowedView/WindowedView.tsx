import { type ReactNode, useState } from "react";
import { type Translatable, tryTranslate } from "../../../i18n/i18n.ts";
import { useTranslation } from "react-i18next";
import { Button } from "../Button/Button.tsx";
import { ButtonGroup } from "../Button/ButtonGroup/ButtonGroup.tsx";
import styles from "./WindowedView.module.css";

export type Window = {
  title: Translatable;
  body: ReactNode;
};

type WindowedViewProps = {
  startWindow?: Window;
  windows: Window[];
};

export function WindowedView({ startWindow, windows }: WindowedViewProps) {
  const { t } = useTranslation();
  const [window, setWindow] = useState<Window | null>(
    startWindow ?? windows[0],
  );
  return (
    <div className={styles.container}>
      <ButtonGroup className={styles.tabs}>
        {windows.map((w, i) => (
          <Button key={i} onClick={() => setWindow(w)}>
            {tryTranslate(t, w.title)}
          </Button>
        ))}
      </ButtonGroup>
      <div className={styles.body}>{window && window.body}</div>
    </div>
  );
}
