import { useCallback, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTransformationStore } from "@/lib/store";
import {
  copyToClipboard,
  downloadText,
  getWordCount,
  validateInput,
} from "@/lib/utils";
import type { Language } from "@/types";
import { useTypewriter } from "react-simple-typewriter";
import toast from "react-hot-toast";
import { SelectionTooltip } from "./SelectionTooltip";
import { useAuth } from "@/lib/auth-context";

interface OutputSectionProps {
  toggleDashboard: () => void;
  detectedLanguage: string | null;
  languages: Language[];
  onGuestWarning?: () => void;
  onGuestLimit?: () => void;
  freeLimit?: number;
  warningAfterCount?: number;
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function OutputSection({
  toggleDashboard,
  detectedLanguage,
  languages,
  onGuestWarning,
  onGuestLimit,
  freeLimit = 5,
  warningAfterCount = 3,
}: OutputSectionProps) {
  const {
    outputText,
    clearOutputText,
    setOutputText,
    setTextSelection,
    selectedText,
    selectionStart,
    selectionEnd,
  } = useTransformationStore();
  const { user } = useAuth();
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getGuestCount = () => {
    if (typeof window === "undefined") return 0;
    const v = Number.parseInt(localStorage.getItem("guestGenerationCount") || "0", 10);
    return Number.isFinite(v) ? v : 0;
  };

  const isGuestLimitReached = !user && getGuestCount() >= freeLimit;

  useEffect(() => {
    console.log("Selection state changed:", {
      selectedText,
      selectionStart,
      selectionEnd,
    });
  }, [selectedText, selectionStart, selectionEnd]);

  useEffect(() => {
    setTooltipPosition(null);
    setTextSelection("", -1, -1);
  }, [outputText, setTextSelection]);

  useEffect(() => {
    const { editableText } = useTransformationStore.getState();
    if (editableText && editableText !== outputText) {
      setOutputText(editableText);
    }
  }, [outputText, setOutputText]);

  const clearNativeSelection = useCallback(() => {
    if (textareaRef.current) {
      const pos = textareaRef.current.selectionEnd ?? 0;
      try {
        textareaRef.current.setSelectionRange(pos, pos);
      } catch {
      }
    }
    const selection = window.getSelection?.();
    if (selection && selection.rangeCount > 0) {
      try {
        selection.removeAllRanges();
      } catch {
      }
    }
  }, []);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      const winSelection = window.getSelection?.();
      const hasSelectedText = !!winSelection && winSelection.toString().trim().length > 0;
      const textareaHasSelection = (() => {
        const t = textareaRef.current;
        return !!t && t.selectionStart !== t.selectionEnd;
      })();
      if (hasSelectedText || textareaHasSelection) {
        return;
      }

      if (
        e.target === containerRef.current ||
        e.target === textareaRef.current
      ) {
        setTooltipPosition(null);
        setTextSelection("", -1, -1);
        clearNativeSelection();
      }
    },
    [setTextSelection, clearNativeSelection]
  );

  const handleClearOutput = useCallback(() => {
    clearOutputText();
    if (!user) return;
    fetch("/api/history/sessions/deactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {});
  }, [clearOutputText, user]);

  const outputWordCount = getWordCount(outputText);

  const [typedPlaceholder] = useTypewriter({
    words: [
      "Your transformed text will appear here...",
      "Here will be the rewritten content...",
      "Тут зʼявиться перетворений текст...",
      "Здесь появится преобразованный текст...",
      "Voici le texte transformé...",
      "ここに変換されたテキストが表示されます...",
    ],
    loop: 0,
    delaySpeed: 1500,
    typeSpeed: 60,
    deleteSpeed: 20,
  });

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(outputText);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, [outputText]);

  const handleDownload = useCallback(() => {
    downloadText(outputText, "transformed-text.txt");
    toast.success("Downloaded text file");
  }, [outputText]);

  const getLanguageDisplayName = useCallback(
    (code: string) => {
      const language = languages.find((lang) => lang.code === code);
      return language ? `${language.name} (${language.native_name})` : code;
    },
    [languages]
  );

  const handleTextSelection = useCallback(
    ({ text, start, end }: { text: string; start: number; end: number }) => {
      if (!text || start === end) {
        console.log("No text selected, hiding tooltip");
        setTooltipPosition(null);
        setTextSelection("", -1, -1);
        return;
      }

      console.log("Text selected:", text, "Start:", start, "End:", end);
      setTextSelection(text, start, end);

      setTimeout(() => {
        if (textareaRef.current && containerRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            console.log("Selection rect:", rect);

            const tooltipX = rect.left + rect.width / 2;

            const tooltipY = rect.top;

            console.log("Setting tooltip position (absolute):", {
              x: tooltipX,
              y: tooltipY,
            });
            setTooltipPosition({ x: tooltipX, y: tooltipY });
            return;
          }

          console.log("Using fallback positioning method");
          const textarea = textareaRef.current;
          const textareaRect = textarea.getBoundingClientRect();

          const lineHeight = 20;
          const textBeforeSelection = textarea.value.substring(0, start);
          const linesBeforeSelection = textBeforeSelection.split("\n").length;

          const topOffset = linesBeforeSelection * lineHeight;

          const selectionLength = end - start;
          const charWidth = 8;
          const horizontalOffset =
            start * charWidth + (selectionLength * charWidth) / 2;

          const x =
            textareaRect.left +
            Math.min(Math.max(horizontalOffset, 50), textareaRect.width - 50);

          const y =
            textareaRect.top + Math.min(topOffset, textareaRect.height - 20);

          console.log("Setting tooltip position (fallback absolute):", {
            x,
            y,
          });
          setTooltipPosition({ x, y });
        }
      }, 0);
    },
    [setTextSelection]
  );

  const handleCloseTooltip = useCallback(() => {
    setTooltipPosition(null);
    setTextSelection("", -1, -1);
    clearNativeSelection();
  }, [setTextSelection, clearNativeSelection]);

  const handleTransformSelection = useCallback(
    async (preset: string) => {
      if (!selectedText || selectionStart === -1 || selectionEnd === -1) return;

      if (!user) {
        const currentCount = getGuestCount();
        if (currentCount >= freeLimit) {
          onGuestLimit?.();
          return;
        }
      }

      const textValidation = validateInput(selectedText);
      if (!textValidation.isValid) {
        toast.error(textValidation.error || "Invalid selected text");
        return;
      }

      const presetValidation = validateInput(preset);
      if (!presetValidation.isValid) {
        toast.error("Invalid transformation preset");
        return;
      }

      try {
        const getCookieValue = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };

        const sessionId = getCookieValue("currentSessionId");

        const response = await fetch("/api/transform/selection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(sessionId && { "x-session-id": sessionId }),
          },
          body: JSON.stringify({
            selected_text: selectedText,
            full_text: outputText,
            transformation_preset: preset,
            temperature: 0.7,
            target_language: "auto",
            start_position: selectionStart,
            end_position: selectionEnd,
            sessionId: sessionId,
          }),
        });

        if (response.status === 429) {
          try {
            const body = await response.json();
            const message = (body?.error || "").toString().toLowerCase();
            if (message.includes("provider rate limit") || message.includes("rate limit")) {
              toast("Too many requests to the AI provider. Please try again in a moment.");
            } else {
              toast("You've reached your daily generation limit. Upgrade to Pro to continue.");
            }
          } catch {
            toast("Too many requests. Please try again in a moment.");
          }
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Selection transformation failed");
        }

        const newText =
          outputText.substring(0, selectionStart) +
          data.transformed_selection +
          outputText.substring(selectionEnd);

        setOutputText(newText);

        const newSessionId = getCookieValue("currentSessionId");
        if (newSessionId && newSessionId !== sessionId) {
          console.log("New session created with ID:", newSessionId);
        }

        handleCloseTooltip();
        toast.success("Selection transformed!");
        if (!user) {
          const currentCount = getGuestCount();
          const newCount = currentCount + 1;
          localStorage.setItem("guestGenerationCount", String(newCount));
          if (newCount === warningAfterCount) {
            onGuestWarning?.();
          }
          if (newCount >= freeLimit) {
            toast("You have used all 5 free generations.");
          }
        } else if (user && !user.isPro) {
          window.dispatchEvent(new Event("quota:update"));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage);
      }
    },
    [
      selectedText,
      selectionStart,
      selectionEnd,
      outputText,
      setOutputText,
      handleCloseTooltip,
      user,
      onGuestLimit,
      onGuestWarning,
      freeLimit,
      warningAfterCount,
    ]
  );

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
    >
      <Card variant="elevated" className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-slate-800">Transformed</span>
            {outputText && (
              <div className="flex items-center space-x-2 text-sm text-slate-500 font-normal">
                <span>•</span>
                <span>{pluralize(outputWordCount, "word", "words")}</span>

                {detectedLanguage && (
                  <>
                    <span>•</span>
                    <span>
                      Detected: {getLanguageDisplayName(detectedLanguage)}
                    </span>
                  </>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className="relative"
            ref={containerRef}
            onClick={handleContainerClick}
          >
            <Textarea
              ref={textareaRef}
              placeholder={outputText ? undefined : typedPlaceholder}
              value={outputText}
              readOnly
              rows={12}
              className="min-h-[300px] bg-gradient-to-br from-slate-50/50 to-cyan-50/30 text-base leading-relaxed"
              showCharCount={true}
              sanitize={true}
              renderMarkdown={false}
              onTextSelection={handleTextSelection}
            />
            <AnimatePresence>
              {outputText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-2 right-2"
                >
                  <span
                    title={
                      isGuestLimitReached
                        ? "Free generation limit reached. Create an account to continue."
                        : "Clear output text"
                    }
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearOutput}
                      className="p-1 h-auto hover:text-red-600"
                      disabled={isGuestLimitReached}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selection Tooltip */}
            {tooltipPosition && selectedText && (
              <SelectionTooltip
                position={tooltipPosition}
                onClose={() => {
                  setTooltipPosition(null);
                  setTextSelection("", -1, -1);
                  clearNativeSelection();
                }}
                onTransform={handleTransformSelection}
                containerRef={containerRef}
                modalContext="outputSection"
                isInModal={false}
              />
            )}
          </div>
          {outputText && (
            <div className="text-xs text-slate-500 mt-1">
              Supports Markdown: **bold**, *italic*, `code`, [link](url)
            </div>
          )}
          <AnimatePresence>
            {outputText && (
              <motion.div
                className="flex space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="flex-1">
                  <Button
                    variant="secondary"
                    onClick={handleCopy}
                    className="w-full text-base py-3"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    Copy
                  </Button>
                </motion.div>
                <motion.div>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="px-4 bg-transparent"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div>
                  <Button
                    variant="primary"
                    onClick={toggleDashboard}
                    className="px-4"
                    disabled={!outputText}
                  >
                    <Maximize2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
