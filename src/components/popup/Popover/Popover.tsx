import { type ReactNode, useEffect, useState } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import styles from "./Popover.module.css";
import { Tooltip } from "../Tooltip/Tooltip.tsx";

export type PopoverProps = {
  title?: string | ReactNode;
  tooltip?: string | ReactNode;
  trigger: ReactNode;
  children: ReactNode;
};

export function Popover({ title, tooltip, trigger, children }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "dialog" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const triggerElement = (
    <span
      ref={refs.setReference}
      {...getReferenceProps()}
      className={styles.trigger}
    >
      {trigger}
    </span>
  );
  const tooltipElement = tooltip ?? title;
  return (
    <>
      <Tooltip disabled={!tooltipElement || isOpen} content={tooltipElement}>
        {triggerElement}
      </Tooltip>
      {isMounted && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={styles.container}
          >
            <div
              className={styles.body}
              data-state={isOpen ? "open" : "closed"}
            >
              {title && <div className={styles.title}>{title}</div>}
              {children}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
