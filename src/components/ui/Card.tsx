import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "glass";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-white rounded-2xl shadow-sm border border-gray-200/50 hover:shadow-md transition-all duration-200",
      elevated:
        "bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-200",
      glass:
        "glass rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200",
    };

    return (
      <div
        ref={ref}
        className={cn("p-6", variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-6", className)} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-xl font-bold text-gray-900 tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = "CardTitle";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-gray-600 leading-relaxed", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
