import { type ReactNode, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./Collapsable.module.css";
import { IoIosArrowDown } from "react-icons/io";
import clsx from "clsx";
import { Tooltip } from "../../floating/components/Tooltip/Tooltip.tsx";

export type CollapsableProps = {
  title: string | ReactNode | ((open: boolean) => string | ReactNode);
  color?: string;
  tooltip?: string | ReactNode;
  initialOpen?: boolean;
  children: ReactNode | ((open: boolean) => ReactNode);
};

export function Collapsable({
  title,
  color,
  tooltip,
  children,
  initialOpen = false,
}: CollapsableProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div>
      <Tooltip content={tooltip} disabled={!tooltip} placement="top">
        <div
          className={styles.titleContainer}
          onClick={() => setIsOpen((p) => !p)}
        >
          <div
            className={clsx(styles.title, isOpen && styles.open)}
            style={{ color }}
          >
            <div className={styles.iconContainer}>
              <motion.div
                className={styles.icon}
                initial={false}
                animate={{ rotate: isOpen ? 0 : -90 }}
                transition={{ type: "spring", stiffness: 500, damping: 50 }}
              >
                <IoIosArrowDown />
              </motion.div>
            </div>
            {typeof title === "function" ? title(isOpen) : title}
          </div>
          <motion.div
            className={styles.separator}
            initial={{ opacity: 0, width: "0%", marginTop: 0, marginBottom: 0 }}
            animate={{
              opacity: isOpen ? 1 : 0,
              width: isOpen ? "100%" : "0%",
              marginTop: isOpen ? 4 : 0,
              marginBottom: isOpen ? 4 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Tooltip>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={styles.container}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
          >
            {typeof children === "function" ? children(initialOpen) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
