import styles from "./PillSwitch.module.css";
import clsx from "clsx";
import { motion } from "motion/react";

export type PillSwitchOption = {
  id: string;
  name: string;
};

export type PillSwitchProps = {
  options: PillSwitchOption[];
  selectedOptionId: string;
  onSelect: (optionId: string) => void;
  layoutId?: string;
};

export function PillSwitch({
  options,
  selectedOptionId,
  onSelect,
  layoutId = "pill-switch-indicator",
}: PillSwitchProps) {
  return (
    <div className={styles.container}>
      {options.map((option) => {
        const isActive = option.id === selectedOptionId;
        return (
          <div key={option.id} className={styles.buttonContainer}>
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className={styles.indicator}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 50,
                }}
              />
            )}
            <div
              onClick={() => onSelect(option.id)}
              className={clsx(
                styles.pillButton,
                option.id === selectedOptionId && styles.selected,
              )}
            >
              {option.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}
