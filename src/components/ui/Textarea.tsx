import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 bg-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            "resize-none transition-all duration-200",
            error &&
              "border-red-300 focus:ring-red-500/50 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
