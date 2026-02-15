import styles from "./TaskCard.module.css";
import { type Translatable, useTranslatable } from "../../../shared/i18n/i18n.ts";
import { motion } from "motion/react";

type TaskCardProps = {
  title: Translatable;
  description: Translatable;
  backgroundImageUrl?: string;
};

export function TaskCard({
  title,
  description,
  backgroundImageUrl,
}: TaskCardProps) {
  const { t } = useTranslatable();
  return (
    <motion.div
      className={styles.taskCard}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={
        backgroundImageUrl
          ? { backgroundImage: `url(${backgroundImageUrl})` }
          : {}
      }
    >
      <div className={styles.title}>{t(title)}</div>
      <div className={styles.description}>{t(description)}</div>
    </motion.div>
  );
}
