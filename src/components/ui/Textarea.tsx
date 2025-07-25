"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
  sanitize?: boolean;
  renderMarkdown?: boolean; // Новый пропс для включения markdown
  onTextSelection?: (selection: {
    text: string;
    start: number;
    end: number;
  }) => void;
}

const sanitizeInput = (input: string): string => {
  if (!input) return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
};

// Функция для парсинга простого markdown
const parseMarkdown = (text: string): React.ReactElement => {
  if (!text) return <></>;

  // Разбиваем текст на части, учитывая markdown-разметку
  const parts: React.ReactElement[] = [];
  let currentIndex = 0;
  let partIndex = 0;

  // Регулярное выражение для поиска markdown-разметки
  const markdownRegex =
    /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;

  let match;
  while ((match = markdownRegex.exec(text)) !== null) {
    if (match.index > currentIndex) {
      parts.push(
        <span key={partIndex++}>
          {text.substring(currentIndex, match.index)}
        </span>
      );
    }

    if (match[1]) {
      // Жирный текст **text**
      parts.push(
        <strong key={partIndex++} className="font-bold">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Курсив *text*
      parts.push(
        <em key={partIndex++} className="italic">
          {match[4]}
        </em>
      );
    } else if (match[5]) {
      // Код `text`
      parts.push(
        <code
          key={partIndex++}
          className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono"
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      // Ссылка [text](url)
      parts.push(
        <a
          key={partIndex++}
          href={match[9]}
          className="text-cyan-600 hover:text-cyan-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[8]}
        </a>
      );
    }

    currentIndex = match.index + match[0].length;
  }

  if (currentIndex < text.length) {
    parts.push(<span key={partIndex++}>{text.substring(currentIndex)}</span>);
  }

  return <>{parts}</>;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      maxLength,
      showCharCount = false,
      sanitize = true,
      renderMarkdown = false,
      onChange,
      value,
      readOnly = false,
      onTextSelection,
      onMouseUp,
      onTouchEnd,
      onSelect,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0);
    const [internalValue, setInternalValue] = useState((value as string) || "");
    const [isPreview, setIsPreview] = useState(false);
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    // Объединяем ref
    useEffect(() => {
      if (ref) {
        if (typeof ref === "function") {
          ref(internalRef.current);
        } else {
          ref.current = internalRef.current;
        }
      }
    }, [ref]);

    useEffect(() => {
      setCharCount(internalValue?.length || 0);
    }, [internalValue]);

    useEffect(() => {
      setInternalValue((value as string) || "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let newValue = e.target.value;

      if (sanitize) {
        newValue = sanitizeInput(newValue);
      }

      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }

      setInternalValue(newValue);

      if (onChange) {
        const sanitizedEvent = {
          ...e,
          target: {
            ...e.target,
            value: newValue,
          },
        };
        onChange(sanitizedEvent);
      }
    };

    const getSelectionCoordinates = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return null;

      const range = selection.getRangeAt(0);
      return range.getBoundingClientRect();
    };

    const handleSelectionEvent = (
      e:
        | React.MouseEvent<HTMLTextAreaElement>
        | React.TouchEvent<HTMLTextAreaElement>
    ) => {
      const textarea = internalRef.current;
      if (!textarea) return;

      if (onMouseUp && e.type === "mouseup") {
        onMouseUp(e as React.MouseEvent<HTMLTextAreaElement>);
      } else if (onTouchEnd && e.type === "touchend") {
        onTouchEnd(e as React.TouchEvent<HTMLTextAreaElement>);
      }

      setTimeout(() => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value
          .substring(start || 0, end || 0)
          .trim();

        console.log("Selection event:", { selectedText, start, end });

        if (selectedText && start !== end && onTextSelection) {
          const selectionCoords = getSelectionCoordinates();
          console.log("Selection coordinates:", selectionCoords);

          onTextSelection({
            text: selectedText,
            start: start || 0,
            end: end || 0,
          });
        }
      }, 0);
    };

    const handleSelectionChange = (
      e: React.SyntheticEvent<HTMLTextAreaElement>
    ) => {
      const textarea = e.currentTarget;
      if (!textarea || !onTextSelection) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value
        .substring(start || 0, end || 0)
        .trim();

      console.log("Selection changed:", { selectedText, start, end });

      if (selectedText && start !== end) {
        const selectionCoords = getSelectionCoordinates();
        console.log("Selection coordinates from change:", selectionCoords);

        onTextSelection({
          text: selectedText,
          start: start || 0,
          end: end || 0,
        });
      }

      if (onSelect) {
        onSelect(e as React.SyntheticEvent<HTMLTextAreaElement>);
      }
    };

    useEffect(() => {
      if (!readOnly || !onTextSelection || !internalRef.current) return;

      const handleGlobalMouseUp = () => {
        const textarea = internalRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value
          .substring(start || 0, end || 0)
          .trim();

        if (selectedText && start !== end) {
          console.log("Global mouseup selection:", {
            selectedText,
            start,
            end,
          });
          onTextSelection({
            text: selectedText,
            start: start || 0,
            end: end || 0,
          });
        }
      };

      document.addEventListener("mouseup", handleGlobalMouseUp);

      return () => {
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }, [readOnly, onTextSelection]);

    const showPreview = renderMarkdown && readOnly;

    const showToggleButtons = renderMarkdown && !readOnly;

    return (
      <div className="w-full">
        {label && (
          <motion.label
            className="block text-sm font-semibold text-slate-700 mb-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}

        {showToggleButtons && (
          <div className="flex mb-2 bg-slate-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                !isPreview
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Редактировать
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                isPreview
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Предварительный просмотр
            </button>
          </div>
        )}

        {/* Textarea*/}
        {(showPreview && value) || (renderMarkdown && isPreview && value) ? (
          <motion.div
            className={cn(
              "w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm bg-white/80 backdrop-blur-sm overflow-y-auto",
              "min-h-[100px] text-slate-900 whitespace-pre-wrap",
              error && "border-red-300",
              className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              height: props.rows
                ? `${parseInt(props.rows.toString()) * 28.5}px`
                : "auto",
              maxHeight: props.rows
                ? `${parseInt(props.rows.toString()) * 28.5}px`
                : "auto",
            }}
          >
            {parseMarkdown(internalValue)}
          </motion.div>
        ) : (
          <motion.textarea
            className={cn(
              "w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 bg-white/80 backdrop-blur-sm",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:bg-white",
              "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
              "resize-none transition-all duration-200 text-slate-900",
              error &&
                "border-red-300 focus:ring-red-500/50 focus:border-red-500",
              className
            )}
            ref={internalRef}
            value={internalValue}
            onChange={handleChange}
            readOnly={readOnly}
            onMouseUp={handleSelectionEvent}
            onTouchEnd={handleSelectionEvent}
            onSelect={handleSelectionChange}
            transition={{ duration: 0.1 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props as any)}
          />
        )}

        <div className="flex justify-between mt-2.5">
          {error && (
            <motion.p
              className="text-sm text-red-600 flex items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
              {error}
            </motion.p>
          )}
          {helperText && !error && (
            <motion.p
              className="text-sm text-slate-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {helperText}
            </motion.p>
          )}
          {(showCharCount || maxLength) && (
            <motion.p
              className={`text-xs ${
                maxLength && charCount >= maxLength * 0.9
                  ? "text-amber-600"
                  : "text-slate-500"
              } ml-auto`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {charCount}
              {maxLength ? `/${maxLength}` : ""} characters
            </motion.p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
