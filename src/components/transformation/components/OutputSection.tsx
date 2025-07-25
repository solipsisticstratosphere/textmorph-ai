import { useCallback, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTransformationStore } from "@/lib/store";
import { copyToClipboard, downloadText, getWordCount } from "@/lib/utils";
import type { Language } from "@/types";
import { useTypewriter } from "react-simple-typewriter";
import toast from "react-hot-toast";
import { SelectionTooltip } from "./SelectionTooltip";

interface OutputSectionProps {
  toggleDashboard: () => void;
  detectedLanguage: string | null;
  languages: Language[];
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function OutputSection({
  toggleDashboard,
  detectedLanguage,
  languages,
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
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Selection state changed:", {
      selectedText,
      selectionStart,
      selectionEnd,
    });
  }, [selectedText, selectionStart, selectionEnd]);

  // Обновляем состояние при изменении outputText
  useEffect(() => {
    // Сбрасываем тултип при изменении текста
    setTooltipPosition(null);
    setTextSelection("", -1, -1);
  }, [outputText, setTextSelection]);

  // Следим за изменениями в editableText из модального окна
  useEffect(() => {
    const { editableText } = useTransformationStore.getState();
    if (editableText && editableText !== outputText) {
      setOutputText(editableText);
    }
  }, [outputText, setOutputText]);

  const handleContainerClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.target === containerRef.current ||
        e.target === textareaRef.current
      ) {
        setTooltipPosition(null);
        setTextSelection("", -1, -1);
      }
    },
    [setTextSelection]
  );

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

            // Позиционируем тултип по центру выделенного текста
            const tooltipX = rect.left + rect.width / 2;
            // Позиционируем тултип над выделенным текстом
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
          // Позиционируем тултип над текстом
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
  }, [setTextSelection]);

  const handleTransformSelection = useCallback(
    async (preset: string) => {
      if (!selectedText || selectionStart === -1 || selectionEnd === -1) return;

      try {
        const response = await fetch("/api/transform/selection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selected_text: selectedText,
            full_text: outputText,
            transformation_preset: preset,
            temperature: 0.7,
            target_language: "auto",
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Selection transformation failed");
        }

        // Replace the selected text in the output
        const newText =
          outputText.substring(0, selectionStart) +
          data.transformed_selection +
          outputText.substring(selectionEnd);

        setOutputText(newText);
        handleCloseTooltip();
        toast.success("Selection transformed!");
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
              renderMarkdown={false} // Отключаем markdown для корректного выделения
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearOutputText}
                    className="p-1 h-auto hover:text-red-600"
                    title="Clear output text"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
