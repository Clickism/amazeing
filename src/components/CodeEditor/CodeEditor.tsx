import { Window } from "../ui/Window/Window.tsx";
import { useTranslation } from "react-i18next";
import styles from "./CodeEditor.module.css";

export function CodeEditor() {
  const { t } = useTranslation();
  return (
    <Window title={t("codeEditor.title")}>
      <textarea className={styles.codeEditor}>Code Editor</textarea>
    </Window>
  );
}
