import { type ReactNode, useEffect, useState } from "react";
import {
  autoUpdate,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import styles from "./Tooltip.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { FloatingContext } from "../FloatingContext/FloatingContext.tsx"; // Add these

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  disabled?: boolean;
  referenceProps?: Record<string, unknown>;
};

export function Tooltip({
  content,
  referenceProps,
  children,
  disabled = false,
  delay = 150,
}: TooltipProps) {
  const [isOpen, setIsOpenState] = useState(false);

  const setIsOpen = (open: boolean) => {
    if (!disabled) {
      setIsOpenState(open);
    }
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), shift({ padding: 4 })],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    delay: { open: delay },
    move: false,
  });

  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    role,
  ]);

  useEffect(() => {
    if (disabled) setIsOpenState(false);
  }, [disabled]);

  return (
    <FloatingContext.Provider value={{ isOpen, setOpen: setIsOpen }}>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        {...referenceProps}
        className={styles.trigger}
      >
        {children}
      </span>

      <AnimatePresence>
        {!disabled && isOpen && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 10000 }}
              {...getFloatingProps()}
              className={styles.container}
            >
              <motion.div
                className={styles.tooltip}
                initial={{
                  opacity: 0,
                  filter: "blur(8px)",
                  scale: 0.95,
                  transformOrigin: "top",
                  translateY: -4,
                }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  scale: 1,
                  translateY: 0,
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(4px)",
                  scale: 0.95,
                  translateY: -4,
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                {content}
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </FloatingContext.Provider>
  );
}
