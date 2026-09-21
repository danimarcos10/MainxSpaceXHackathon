import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-white shadow-lg shadow-brand/15 hover:-translate-y-0.5 hover:bg-brand-dark disabled:shadow-none",
  secondary:
    "border border-line bg-white text-ink shadow-sm hover:-translate-y-0.5 hover:border-brand/35",
  ghost: "bg-transparent text-muted hover:bg-white hover:text-ink",
  dark: "bg-ink text-white shadow-lg shadow-ink/10 hover:-translate-y-0.5 hover:bg-brand",
  danger: "bg-danger-soft text-danger hover:bg-danger hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return `inline-flex items-center justify-center gap-2 rounded-[0.875rem] font-bold transition duration-200 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-line disabled:text-subtle ${variants[variant]} ${sizes[size]} ${className}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
