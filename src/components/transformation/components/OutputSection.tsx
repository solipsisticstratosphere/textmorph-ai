import { useCallback } from "react";
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
  getCharacterCount,
} from "@/lib/utils";
import type { Language } from "@/types";

interface OutputSectionProps {
  copySuccess: boolean;
  setCopySuccess: (success: boolean) => void;
  toggleDashboard: () => void;
  detectedLanguage: string | null;
  languages: Language[];
}

export function OutputSection({
  copySuccess,
  setCopySuccess,
  toggleDashboard,
  detectedLanguage,
  languages,
}: OutputSectionProps) {
  const { outputText, clearOutputText } = useTransformationStore();

  const outputWordCount = getWordCount(outputText);
  const outputCharCount = getCharacterCount(outputText);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(outputText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Handle error if needed
    }
  }, [outputText, setCopySuccess]);

  const handleDownload = useCallback(() => {
    downloadText(outputText, "transformed-text.txt");
  }, [outputText]);

  const getLanguageDisplayName = useCallback(
    (code: string) => {
      const language = languages.find((lang) => lang.code === code);
      return language ? `${language.name} (${language.native_name})` : code;
    },
    [languages]
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
            <span className="text-slate-800">Transformed Text</span>
            {outputText && (
              <div className="flex items-center space-x-2 text-sm text-slate-500 font-normal">
                <span>•</span>
                <span>{outputWordCount} words</span>
                <span>•</span>
                <span>{outputCharCount} characters</span>
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
          <div className="relative">
            <Textarea
              placeholder="Your transformed text will appear here... ✨"
              value={outputText}
              readOnly
              rows={12}
              className="min-h-[300px] bg-gradient-to-br from-slate-50/50 to-cyan-50/30 text-base leading-relaxed"
              showCharCount={true}
              sanitize={true}
              renderMarkdown={true}
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
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="secondary"
                    onClick={handleCopy}
                    className="w-full text-base py-3"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    {copySuccess ? "Copied!" : "Copy"}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="px-4 bg-transparent"
                  >
                    <Download className="w-5 h-5" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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
