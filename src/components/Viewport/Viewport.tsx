import { useTranslation } from "react-i18next";
import { Window } from "../ui/Window/Window.tsx";
import styles from "./Viewport.module.css";

export function Viewport() {
  const { t } = useTranslation();
  return (
    <Window title={t("viewport.title")}>
      <div className={styles.viewport}>Viewport</div>
    </Window>
  );
}
