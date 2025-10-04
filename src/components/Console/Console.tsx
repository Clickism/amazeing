import { Window } from "../ui/Window/Window.tsx";
import { useTranslation } from "react-i18next";
import styles from "./Console.module.css";

export function Console({ text }: { text: string }) {
  const { t } = useTranslation();
  return (
    <Window title={t("console.title")}>
      <div className={styles.console}>
        {text}
      </div>
    </Window>
  );
}
