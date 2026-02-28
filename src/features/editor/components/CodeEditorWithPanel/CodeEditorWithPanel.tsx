import { AnimatePresence, motion } from "motion/react";
import { Panel } from "../../../../shared/components/Panel/Panel.tsx";
import { CodeEditor, type CodeEditorProps } from "../CodeEditor/CodeEditor.tsx";
import { Button } from "../../../../shared/components/Button/Button.tsx";
import styles from "./CodeEditorWithPanel.module.css";
import { type ReactNode, useState } from "react";
import { useCalculateLayout } from "../../../../shared/utils/useCalculateLayout.tsx";
import clsx from "clsx";

type PanelProps = {
  name: string;
  content: ReactNode;
  icon: (open: boolean) => ReactNode;
};

export type CodeEditorWithPanelProps = CodeEditorProps & {
  initialOpen?: boolean;
  panel: PanelProps;
};

export function CodeEditorWithPanel({
  initialOpen = false,
  panel,
  topBar,
  ...props
}: CodeEditorWithPanelProps) {
  const [panelOpen, setPanelOpen] = useState(initialOpen);
  const { isMobile } = useCalculateLayout();
  return (
    <div className={clsx(styles.container, isMobile && styles.mobile)}>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={styles.editorContainer}
      >
        <Panel paddingless>
          <CodeEditor
            {...props}
            topBar={{
              left: topBar?.left,
              right: [
                <Button onClick={() => setPanelOpen((prev) => !prev)}>
                  {panel.icon(panelOpen)}
                  {panel.name}
                </Button>,
                ...(topBar?.right ?? []),
              ],
            }}
          />
        </Panel>
      </motion.div>
      <AnimatePresence mode="popLayout">
        {panelOpen && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Panel paddingless>{panel.content}</Panel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
