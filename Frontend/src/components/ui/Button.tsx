import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "dark" | "accent" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-dark",
  dark: "bg-surface-muted text-ink hover:bg-line-strong",
  accent: "bg-accent-soft text-accent hover:bg-brand/25",
  outline: "border border-line-strong bg-surface text-ink hover:border-accent",
  ghost: "text-ink hover:bg-surface-muted",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

interface StyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function buttonStyles({ variant = "primary", size = "md", fullWidth }: StyleOptions = {}) {
  return cn(base, variantClasses[variant], sizeClasses[size], fullWidth && "w-full");
}

interface ButtonProps extends ComponentProps<"button">, StyleOptions {
  loading?: boolean;
  leftIcon?: ReactNode;
}

export function Button({
  variant,
  size,
  fullWidth,
  loading,
  leftIcon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : leftIcon}
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link>, StyleOptions {}

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant, size, fullWidth }), className)} {...props} />;
}
