import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  RotateCcw,
  Thermometer,
  Globe,
  Trash2,
  PencilLine,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTransformationStore } from "@/lib/store";
import { validateInput, getWordCount, getCharacterCount } from "@/lib/utils";
import type { Language } from "@/types";
import { useTypewriter } from "react-simple-typewriter";
import toast from "react-hot-toast";

interface InputSectionProps {
  onTransform: () => Promise<void>;
  isLoading: boolean;
}
function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}
export function InputSection({ onTransform, isLoading }: InputSectionProps) {
  const {
    inputText,
    instruction,
    temperature,
    selectedLanguage,
    setInputText,
    setInstruction,
    setTemperature,
    setSelectedLanguage,
    clearInputText,
    clearAll,
  } = useTransformationStore();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [typingPlaceholder, setTypingPlaceholder] = useState("");

  const [text] = useTypewriter({
    words: [
      "Paste or type your text here...",
      "Write something interesting...",
      "Напишіть щось цікаве...",
      "Напиши что-то интересное...",
      "Écris quelque chose d'intéressant...",
      "面白いことを書いてください...",
    ],
    loop: 0,
    typeSpeed: 50,
    deleteSpeed: 30,
    delaySpeed: 2000,
  });

  useEffect(() => {
    setTypingPlaceholder(text);
  }, [text]);
  // Fetch supported languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("/api/languages");
        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }
        const data = await response.json();
        if (data.success && data.languages) {
          setLanguages(data.languages);
        } else {
          setLanguages([
            { code: "auto", name: "Auto-detect", native_name: "Auto-detect" },
            { code: "en", name: "English", native_name: "English" },
            { code: "ru", name: "Russian", native_name: "Русский" },
          ]);
        }
      } catch (err) {
        console.error("Error fetching languages:", err);
        setLanguages([
          { code: "auto", name: "Auto-detect", native_name: "Auto-detect" },
          { code: "en", name: "English", native_name: "English" },
          { code: "ru", name: "Russian", native_name: "Русский" },
        ]);
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    fetchLanguages();
  }, []);

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedLanguage(e.target.value);
    },
    [setSelectedLanguage]
  );

  const handleTemperatureChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(e.target.value);
      setTemperature(value);
    },
    [setTemperature]
  );

  const handleClear = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const inputWordCount = getWordCount(inputText);
  const inputCharCount = getCharacterCount(inputText);

  const handleTransformClick = useCallback(async () => {
    const validation = validateInput(inputText);
    if (!validation.isValid) {
      toast.error(validation.error || "Invalid input");
      return;
    }

    if (!instruction.trim()) {
      toast.error("Please provide transformation instructions");
      return;
    }

    await onTransform();
  }, [inputText, instruction, onTransform]);

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
            <span className="text-slate-800">Input Text</span>
            <div className="flex items-center space-x-2 text-sm text-slate-500 font-normal">
              <span>•</span>
              <span>{pluralize(inputWordCount, "word", "words")}</span>
              <span>•</span>
              <span>{inputCharCount} characters</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Textarea
              placeholder={inputText === "" ? typingPlaceholder : undefined}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              className="min-h-[300px] text-base leading-relaxed"
              maxLength={10000}
              showCharCount={true}
              sanitize={true}
            />
            <AnimatePresence>
              {inputText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-2 right-2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearInputText}
                    className="p-1 h-auto hover:text-red-600"
                    title="Clear input text"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="relative w-full">
            {/* Кастомный плейсхолдер */}
            {instruction === "" && (
              <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 pointer-events-none space-x-2 z-10">
                <span className="text-sm">
                  Describe how you want to transform the text...
                </span>
                <PencilLine className="w-4 h-4" />
              </div>
            )}
            <Input
              placeholder=""
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="text-base"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg">
              <Thermometer className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span className="text-sm text-slate-700 whitespace-nowrap min-w-[120px] flex items-center">
                Temperature: {temperature.toFixed(1)}
                <div className="relative ml-1 group">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                    max-w-72 w-max p-2 bg-slate-800 text-white text-xs rounded shadow-lg 
                    opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none 
                    break-words whitespace-normal overflow-hidden"
                  >
                    Controls the randomness of the text transformation. Lower
                    values produce more predictable results, while higher values
                    create more creative and varied outputs.
                  </div>
                </div>
              </span>

              <div className="flex-1 relative h-6 bg-gray-200 rounded-full overflow-hidden">
                {/* Жидкость с волновым эффектом */}
                <div
                  className="absolute bottom-0 left-0 h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${temperature * 100}%`,
                    background: `linear-gradient(45deg, 
    #bae6fd ${temperature < 0.3 ? "100%" : "0%"},  /* light blue */
    #60a5fa ${temperature < 0.6 ? "100%" : "0%"},  /* blue-400 */
    #1d4ed8 100%                                   /* blue-700 */
  )`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-full h-full opacity-50"
                    style={{
                      background: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 10px,
                    rgba(255,255,255,0.2) 10px,
                    rgba(255,255,255,0.2) 20px
                  )`,
                      animation:
                        temperature > 0.1 ? "wave 2s linear infinite" : "none",
                    }}
                  />
                </div>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={handleTemperatureChange}
                  className="absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer opacity-0 z-10"
                />

                <style jsx>{`
                  @keyframes wave {
                    0% {
                      transform: translateX(-20px);
                    }
                    100% {
                      transform: translateX(0px);
                    }
                  }
                `}</style>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg">
              <Globe className="w-5 h-5 text-slate-500 flex-shrink-0" />
              <span className="text-sm text-slate-700 whitespace-nowrap min-w-[120px] flex items-center">
                Output Language:
                <div className="relative ml-1 group">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                    max-w-72 w-max p-2 bg-slate-800 text-white text-xs rounded shadow-lg 
                    opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none 
                    break-words whitespace-normal overflow-hidden"
                  >
                    Specifies the language for the transformed output text.
                    Select &quot;Auto-detect&quot; to maintain the original
                    text&apos;s language.
                  </div>
                </div>
              </span>
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="appearance-none cursor-pointer flex-1 min-w-0 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 bg-white text-slate-700"
                disabled={isLoadingLanguages}
              >
                {isLoadingLanguages ? (
                  <option value="auto">Loading languages...</option>
                ) : (
                  languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.native_name})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <motion.div className="flex-1">
              <Button
                onClick={handleTransformClick}
                disabled={!inputText.trim() || !instruction.trim() || isLoading}
                isLoading={isLoading}
                className="w-full text-base py-3"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {isLoading ? "Transforming..." : "Transform Text"}
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isLoading}
                className="px-4 bg-transparent"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
