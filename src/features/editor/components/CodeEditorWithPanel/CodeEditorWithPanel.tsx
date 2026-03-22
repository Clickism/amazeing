import { AnimatePresence, motion } from "motion/react";
import { Panel } from "../../../../shared/components/Panel/Panel.tsx";
import { CodeEditor, type CodeEditorProps } from "../CodeEditor/CodeEditor.tsx";
import { Button } from "../../../../shared/components/Button/Button.tsx";
import styles from "./CodeEditorWithPanel.module.css";
import { type ReactNode, useState } from "react";
import { useCalculateLayout } from "../../../../shared/utils/useCalculateLayout.tsx";
import clsx from "clsx";
import { PanelContainer } from "../../../../shared/components/PanelContainer/PanelContainer.tsx";

type PanelProps = {
  name: string;
  content: ReactNode;
  icon: (open: boolean) => ReactNode;
  minPixels?: number[];
  initialSizes?: number[];
};

export type CodeEditorWithPanelProps = CodeEditorProps & {
  initialOpen?: boolean;
  panel: PanelProps;
  onPanelChange?: (open: boolean) => void;
};

export type PanelMinWidths = {
  codePanel: number;
  sidePanel: number;
  mobile?: Omit<PanelMinWidths, "mobile">;
};

export function CodeEditorWithPanel({
  initialOpen = false,
  panel,
  topBar,
  onPanelChange,
  ...props
}: CodeEditorWithPanelProps) {
  const [panelOpen, setPanelOpen] = useState(initialOpen);
  const { isMobile } = useCalculateLayout();
  return (
    <div className={clsx(styles.container, isMobile && styles.mobile)}>
      <PanelContainer
        // Remount on mobile change to keep panel state in sync
        key={`${isMobile}`}
        orientation={!isMobile ? "horizontal" : "vertical"}
        panelCount={panelOpen ? 2 : 1}
        initialSizes={panel.initialSizes}
        minPixels={panel.minPixels}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={styles.editorContainer}
          style={{ height: "100%" }}
        >
          <Panel paddingless>
            <CodeEditor
              {...props}
              topBar={{
                left: topBar?.left,
                right: [
                  <Button
                    shape={isMobile ? "icon" : "default"}
                    onClick={() => {
                      const next = !panelOpen;
                      setPanelOpen(next);
                      onPanelChange?.(next);
                    }}
                  >
                    {panel.icon(panelOpen)}
                    {isMobile ? undefined : panel.name}
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
              initial={isMobile ? undefined : { x: 300, opacity: 0 }}
              animate={isMobile ? undefined : { x: 0, opacity: 1 }}
              exit={isMobile ? undefined : { x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ height: "100%" }}
            >
              <Panel paddingless>{panel.content}</Panel>
            </motion.div>
          )}
        </AnimatePresence>
      </PanelContainer>
    </div>
  );
}
