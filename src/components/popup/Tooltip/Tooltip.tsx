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

export type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  delay?: number;
  disabled?: boolean;
  referenceProps?: Record<string, unknown>;
};

// TODO: Fix stacking issue near navbar and code editor
export function Tooltip({
  content,
  referenceProps,
  children,
  disabled = false,
  delay = 200,
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
    if (disabled) {
      setIsOpenState(false);
    }
  }, [disabled]);

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        {...referenceProps}
        className={styles.trigger}
      >
        {children}
      </span>

      {!disabled && isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={styles.container}
          >
            <div
              className={styles.tooltip}
              data-state={isOpen ? "open" : "closed"}
            >
              {content}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
