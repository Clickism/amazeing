import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import ThemeToggle from "./ThemeToggle/ThemeToggle.tsx";
import { LanguageToggle } from "./LanguageToggle/LanguageToggle.tsx";

export function Navbar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.left}>
        <Link to="/">Home</Link>
        <Link to="/sandbox">Sandbox</Link>
      </div>
      <div className={styles.right}>
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
