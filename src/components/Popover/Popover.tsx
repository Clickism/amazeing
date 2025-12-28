import Popup from "reactjs-popup";
import type { PopupProps } from "reactjs-popup/dist/types";
import styles from "./Popover.module.css";
import { Tooltip } from "../Tooltip/Tooltip.tsx";

type PopoverProps = {
  title?: string;
  tooltip?: string;
} & PopupProps;

export function Popover({
  title,
  tooltip,
  children,
  trigger,
  ...props
}: PopoverProps) {
  return (
    <Popup
      closeOnDocumentClick
      contentStyle={{
        borderRadius: "1rem",
      }}
      trigger={
        tooltip ? <Tooltip content={tooltip}>{trigger}</Tooltip> : trigger
      }
      {...props}
    >
      {
        <div className={styles.body}>
          {title && <div className={styles.title}>{title}</div>}
          {children}
        </div>
      }
    </Popup>
  );
}
