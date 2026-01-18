import { type ReactNode, useEffect, useState } from "react";
import styles from "./Modal.module.css";
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
import { Tooltip } from "../Tooltip/Tooltip.tsx";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../Button/Button.tsx";
import { IoClose } from "react-icons/io5";
import { CornerGroup } from "../../CornerGroup/CornerGroup.tsx";

type ModalProps = {
  title?: string | ReactNode;
  tooltip?: string | ReactNode;
  closeButton?: boolean;
  trigger: ReactNode;
  children: ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
};

export function Modal({
  title,
  closeButton = true,
  tooltip,
  trigger,
  onOpen,
  onClose,
  children,
}: ModalProps) {
  const [isOpen, setIsOpenState] = useState(false);
  const [, setIsMounted] = useState(false);

  const setIsOpen = (open: boolean) => {
    setIsOpenState(open);
    if (open) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

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

      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, zIndex: 10000 }}
              {...getFloatingProps()}
              className={styles.container}
            >
              <motion.div
                className={styles.body}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  filter: "blur(10px)",
                  transformOrigin: "top right",
                  perspective: "1000px",
                  rotateX: "-10deg",
                  rotateY: "10deg",
                  rotateZ: "2deg",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  perspective: 0,
                  rotateX: "0deg",
                  rotateY: "0deg",
                  rotateZ: "0deg",
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  filter: "blur(10px)",
                  perspective: "1000px",
                  rotateX: "-10deg",
                  rotateY: "10deg",
                  rotateZ: "2deg",
                }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.content}>{children}</div>
                {closeButton && (
                  <CornerGroup>
                    <Button shape="icon" onClick={close}>
                      <IoClose size={20} />
                    </Button>
                  </CornerGroup>
                )}
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}
