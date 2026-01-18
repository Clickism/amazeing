import { type ReactNode, useState } from "react";
import styles from "./Modal.module.css";
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
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

  const setIsOpen = (open: boolean) => {
    setIsOpenState(open);
    if (open) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
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

  return (
    <>
      {/*Tooltip*/}
      <Tooltip disabled={!tooltip || isOpen} content={tooltip}>
        <span
          ref={refs.setReference}
          {...getReferenceProps()}
          className={styles.trigger}
        >
          {trigger}
        </span>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <FloatingPortal>
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
              className={styles.overlayWrapper}
            >
              <FloatingOverlay
                lockScroll
                className={styles.overlay}
                style={{ zIndex: 10000 }}
              >
                <FloatingFocusManager context={context}>
                  <div
                    ref={refs.setFloating}
                    className={styles.container}
                    {...getFloatingProps()}
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
                      <div className={styles.header}>
                        {title && <div className={styles.title}>{title}</div>}
                        {closeButton && (
                          <CornerGroup>
                            <Button
                              variant="background"
                              shape="icon"
                              onClick={() => setIsOpenState(false)}
                            >
                              <IoClose size={20} />
                            </Button>
                          </CornerGroup>
                        )}
                      </div>
                      <div className={styles.content}>{children}</div>
                    </motion.div>
                  </div>
                </FloatingFocusManager>
              </FloatingOverlay>
            </motion.div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
}
