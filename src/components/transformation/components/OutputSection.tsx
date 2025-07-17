import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTransformationStore } from "@/lib/store";
import { copyToClipboard, downloadText, getWordCount } from "@/lib/utils";
import type { Language } from "@/types";
import { useTypewriter } from "react-simple-typewriter";

interface OutputSectionProps {
  copySuccess: boolean;
  setCopySuccess: (success: boolean) => void;
  toggleDashboard: () => void;
  detectedLanguage: string | null;
  languages: Language[];
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
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
  // const outputCharCount = getCharacterCount(outputText);
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
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {}
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
          <div className="relative">
            <Textarea
              placeholder={outputText ? undefined : typedPlaceholder}
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
                <motion.div className="flex-1">
                  <Button
                    variant="secondary"
                    onClick={handleCopy}
                    className="w-full text-base py-3"
                  >
                    <Copy className="w-5 h-5 mr-2" />
                    {copySuccess ? "Copied!" : "Copy"}
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
