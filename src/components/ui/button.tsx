"use client";

import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from "react";
import clsx from "clsx";

type NativeButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-300 focus-visible:ring-indigo-500",
  secondary:
    "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 disabled:bg-slate-100",
  ghost: "bg-transparent text-slate-200 hover:bg-white/10",
  danger:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-500 disabled:bg-rose-300 focus-visible:ring-rose-500",
};

type ButtonProps = NativeButtonProps & {
  variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-70",
          variantClasses[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

