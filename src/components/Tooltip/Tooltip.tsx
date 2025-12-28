import type { ReactNode } from "react";
import styles from "./Tooltip.module.css";
import Popup from "reactjs-popup";
import type { PopupProps } from "reactjs-popup/dist/types";

type TooltipProps = {
  content: string | ReactNode;
  children: ReactNode;
} & PopupProps;

export function Tooltip({ content, children, ...props }: TooltipProps) {
  return (
    <div>
      <Popup
        trigger={children}
        on={["hover"]}
        contentStyle={{
          borderRadius: ".25rem",
        }}
        keepTooltipInside
        {...props}
      >
        <div className={styles.content}>{content}</div>
      </Popup>
    </div>
  );
}
