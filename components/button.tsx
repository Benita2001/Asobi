import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "large";

const baseStyles =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-300 disabled:cursor-not-allowed disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  secondary:
    "border-2 border-slate-200 bg-white text-slate-800 hover:border-teal-300 hover:bg-teal-50",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "px-5 py-2.5 text-base",
  large: "px-7 py-3.5 text-lg",
};

function buttonStyles(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
) {
  return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Readonly<{
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
  }>;

export function Button({
  children,
  className = "",
  size = "default",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles(variant, size, className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = Readonly<{
  children: ReactNode;
  className?: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}>;

export function ButtonLink({
  children,
  className = "",
  href,
  size = "default",
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link className={buttonStyles(variant, size, className)} href={href}>
      {children}
    </Link>
  );
}
