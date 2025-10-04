import {type ButtonHTMLAttributes, forwardRef} from "react";
import clsx from "clsx";
import styles from "./Button.module.css";
import {useNavigate} from "react-router";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  linkTo?: string;
  variant?: 'primary' | 'secondary';
  flex?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
     linkTo,
     variant = 'secondary',
     flex = true,
     className,
     children,
     ...props
   }, ref) => {
    const navigate = useNavigate();
    return (
      <button
        ref={ref}
        className={clsx(styles.button, styles[variant], flex && styles.flex, className)} {...props}
        {...(linkTo ? {onClick: () => navigate(linkTo)} : undefined)}
      >
        {children}
      </button>
    )
  }
);

Button.displayName = 'Button';
