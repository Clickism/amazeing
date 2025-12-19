import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import styles from "./Button.module.css";
import { useNavigate } from "react-router";

export type ButtonVariant =
  | "none"
  | "primary"
  | "secondary"
  | "disabled"
  | "success"
  | "danger"
  | "background"
  | "outlined";

export type ButtonShape = "default" | "icon";

export type ButtonSize = "small" | "medium" | "large";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  linkTo?: string;
  variant?: ButtonVariant;
  shape?: ButtonShape;
  size?: ButtonSize;
  flex?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      linkTo,
      variant = "secondary",
      shape = "default",
      size = "large",
      flex = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const navigate = useNavigate();
    return (
      <button
        ref={ref}
        className={clsx(
          styles.button,
          styles[`variant-${variant}`],
          styles[`shape-${shape}`],
          styles[`size-${size}`],
          className,
        )}
        {...props}
        {...(linkTo ? { onClick: () => navigate(linkTo) } : undefined)}
      >
        {flex ? (
          <span className={styles.flexContainer}>{children}</span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
