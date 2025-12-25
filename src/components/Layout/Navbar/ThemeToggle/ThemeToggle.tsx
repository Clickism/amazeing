import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";
import { BiMoon } from "react-icons/bi";
import { ImSun } from "react-icons/im";
import {
  applyCurrentTheme,
  getTheme,
  type Theme,
  toggleTheme,
} from "../../../../utils/themes.ts";
import { useEditorSettings } from "../../../../context/EditorSettingsContext.tsx";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getTheme());
  const { refreshEditorTheme } = useEditorSettings();

  useEffect(() => {
    applyCurrentTheme();
    refreshEditorTheme();
  }, [theme]);

  const handleClick = () => {
    toggleTheme();
    setTheme(getTheme());
  };

  return (
    <button onClick={handleClick} className={styles.themeToggle}>
      {theme === "light" ? <ImSun size={20} /> : <BiMoon size={20} />}
    </button>
  );
}
