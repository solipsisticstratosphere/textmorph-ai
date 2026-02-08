import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadText(
  text: string,
  filename: string = "transformed-text.txt"
): void {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPDF(
  content: string,
  filename: string = "transformed-text"
): Promise<void> {
  try {
    const { Document, Page, Text, pdf, StyleSheet } = await import(
      "@react-pdf/renderer"
    );
    const React = await import("react");

    const styles = StyleSheet.create({
      page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 30,
      },
      text: {
        fontSize: 12,
        lineHeight: 1.5,
      },
    });

    const stripHtml = (html: string) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const MyDocument = () =>
      React.createElement(
        Document,
        {},
        React.createElement(
          Page,
          { size: "A4", style: styles.page },
          React.createElement(Text, { style: styles.text }, stripHtml(content))
        )
      );

    const pdfBlob = await pdf(React.createElement(MyDocument)).toBlob();
    const url = URL.createObjectURL(pdfBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("Failed to generate PDF");
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateInput(text: string): {
  isValid: boolean;
  error?: string;
} {
  if (!text || !text.trim()) {
    return { isValid: false, error: "Please enter some text to transform" };
  }

  if (text.length > 10000) {
    return {
      isValid: false,
      error: "Text is too long. Please limit to 10,000 characters.",
    };
  }

  const sqlInjectionPattern =
    /('--)|(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE){0,1}|INSERT( +INTO){0,1}|MERGE|SELECT|UPDATE|UNION( +ALL){0,1})\b)/i;
  if (sqlInjectionPattern.test(text)) {
    return {
      isValid: false,
      error:
        "Invalid input detected. Please remove SQL keywords or special characters.",
    };
  }

  return { isValid: true };
}

export function getWordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function getCharacterCount(text: string): number {
  return text.length;
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = getWordCount(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Validates that a name contains only letters, spaces, and hyphens
 * @param name The name to validate
 * @returns boolean indicating whether the name is valid
 */
export const isValidName = (name: string): boolean => {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-]+$/.test(name);
};

/**
 * Sanitizes input text to prevent XSS attacks
 * @param text The text to sanitize
 * @returns Sanitized text
 */
export function sanitizeInput(text: string): string {
  if (!text) return "";
  return text

    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")

    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")

    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")

    .replace(/javascript:[^\s"'<>]*(?=[\s"'<>])/gi, "")

    .replace(/data:[^\s"'<>]*(?=[\s"'<>])/gi, "")
    .trim();
}
