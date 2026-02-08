"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "dashboard"
    | "signin";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

    const variants = {
      primary:
        "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 focus:ring-cyan-500 shadow-lg hover:shadow-xl border-none disabled:hover:from-cyan-600 disabled:hover:to-blue-600 disabled:hover:shadow-lg",
      secondary:
        "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 focus:ring-teal-500 shadow-lg hover:shadow-xl border border-teal-600/20 disabled:hover:from-teal-600 disabled:hover:to-cyan-600 disabled:hover:shadow-lg",
      outline:
        "border-2 border-slate-300 bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-cyan-500 shadow-sm hover:shadow-md disabled:hover:bg-white/80 disabled:hover:border-slate-300 disabled:hover:shadow-sm",
      ghost: "text-slate-600 focus:ring-slate-500 bg-transparent",
      danger:
        "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 focus:ring-red-500 shadow-lg hover:shadow-xl border border-red-600/20 disabled:hover:from-red-600 disabled:hover:to-pink-600 disabled:hover:shadow-lg",
      dashboard:
        "bg-transparent text-white hover:from-cyan-700 hover:to-blue-700 focus:ring-cyan-500 shadow-lg hover:shadow-xl border border-cyan-600/20 disabled:hover:shadow-lg",
      signin:
        "text-slate-600 focus:ring-slate-500 bg-white/80 backdrop-blur-sm  hover:bg-slate-50 hover:border-slate-400 focus:ring-cyan-500  hover:shadow-md disabled:hover:bg-white/80 disabled:hover:border-slate-300 disabled:hover:shadow-sm",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3 text-base",
    };

    return (
      <motion.button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        transition={{ duration: 0.1 }}
        // Type assertion needed: Framer Motion's event handlers conflict with HTML drag events
        {...(props as any)}
      >
        {/* Shimmer effect for primary and secondary buttons */}
        {(variant === "primary" || variant === "secondary") &&
          !disabled &&
          !isLoading && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "linear",
              }}
            />
          )}

        {isLoading && (
          <motion.div
            className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
