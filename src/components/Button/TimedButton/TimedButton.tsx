import { type ReactNode, useCallback, useState } from "react";
import { Button, type ButtonProps } from "../Button.tsx";

export type TimedButtonProps = {
  children: (active: boolean) => ReactNode | string;
  timeoutMs?: number;
} & Omit<ButtonProps, "children">;

export function TimedButton({
  children,
  onClick,
  timeoutMs = 3000,
  ...props
}: TimedButtonProps) {
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const startTimer = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setTimeoutId(null);
    }, timeoutMs);
    setTimeoutId(id);
  }, [timeoutId, timeoutMs]);

  return (
    <Button
      {...props}
      onClick={(e) => {
        onClick?.(e);
        startTimer();
      }}
    >
      {children(!!timeoutId)}
    </Button>
  );
}
