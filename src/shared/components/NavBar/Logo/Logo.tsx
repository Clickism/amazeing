import logo from "../../../../assets/logo.png";
import styles from "./Logo.module.css";
import { NavBarLink } from "../NavBarLink/NavBarLink.tsx";
import { motion } from "motion/react";
import { useCalculateLayout } from "../../../utils/useCalculateLayout.tsx";
import clsx from "clsx";

export function Logo() {
  const { isMobile } = useCalculateLayout();
  return (
    <NavBarLink
      to="/"
      dontMatch
      style={{ padding: 0 }}
      className={styles.logoLink}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <img src={logo} alt="Amazeing Logo" className={clsx(styles.logo, isMobile && styles.mobile)} />
      </motion.div>
    </NavBarLink>
  );
}
