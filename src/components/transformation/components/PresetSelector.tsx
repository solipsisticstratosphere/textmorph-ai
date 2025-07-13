import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileText,
  MessageSquare,
  List,
  Expand,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTransformationStore } from "@/lib/store";
import type { TransformationPreset } from "@/types";

interface EnhancedTransformationPreset extends TransformationPreset {
  recommended_temperature?: number;
}

const FALLBACK_PRESETS: EnhancedTransformationPreset[] = [
  {
    id: "professional",
    name: "Make Professional",
    description: "Transform casual text into professional communication",
    instruction_template:
      "Rewrite this text in a professional, formal tone suitable for business communication",
    category: "tone",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "casual",
    name: "Make Casual",
    description: "Convert formal text to casual, friendly language",
    instruction_template: "Rewrite this text in a casual, friendly tone",
    category: "tone",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: "bullet-points",
    name: "Bullet Points",
    description: "Convert text into clear, structured bullet points",
    instruction_template:
      "Convert this text into clear, well-organized bullet points",
    category: "format",
    icon: <List className="w-4 h-4" />,
  },
  {
    id: "summary",
    name: "Summarize",
    description: "Create a concise summary of the main points",
    instruction_template:
      "Create a concise summary of the main points in this text",
    category: "length",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "expand",
    name: "Expand",
    description: "Add more detail and explanation to the text",
    instruction_template:
      "Expand this text with more detail and explanation while maintaining the core message",
    category: "length",
    icon: <Expand className="w-4 h-4" />,
  },
];

const PRESET_ICONS: Record<string, React.ReactNode> = {
  professional: <FileText className="w-4 h-4" />,
  casual: <MessageSquare className="w-4 h-4" />,
  "bullet-points": <List className="w-4 h-4" />,
  summary: <Zap className="w-4 h-4" />,
  expand: <Expand className="w-4 h-4" />,
};

export function PresetSelector() {
  const { setInstruction, setTemperature } = useTransformationStore();
  const [selectedPreset, setSelectedPreset] =
    useState<EnhancedTransformationPreset | null>(null);
  const [presets, setPresets] = useState<EnhancedTransformationPreset[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);
  const [showAllPresets, setShowAllPresets] = useState(false);

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const response = await fetch("/api/presets");
        if (!response.ok) {
          throw new Error("Failed to fetch presets");
        }
        const data = await response.json();
        if (data.success && data.presets) {
          const presetsWithIcons = data.presets.map(
            (preset: EnhancedTransformationPreset) => ({
              ...preset,
              icon: PRESET_ICONS[preset.id] || <FileText className="w-4 h-4" />,
            })
          );
          setPresets(presetsWithIcons);
        } else {
          setPresets(FALLBACK_PRESETS);
        }
      } catch (err) {
        console.error("Error fetching presets:", err);
        setPresets(FALLBACK_PRESETS);
      } finally {
        setIsLoadingPresets(false);
      }
    };

    fetchPresets();
  }, []);

  const handlePresetSelect = useCallback(
    (preset: EnhancedTransformationPreset) => {
      setSelectedPreset(preset);
      setInstruction(preset.instruction_template);
      if (preset.recommended_temperature !== undefined) {
        setTemperature(preset.recommended_temperature);
      }
    },
    [setInstruction, setTemperature]
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
      <Card variant="glass" className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <motion.div
                className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-slate-800">Quick Transformations</span>
            </CardTitle>
            {presets.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllPresets(!showAllPresets)}
                className="text-slate-600 hover:text-slate-800"
              >
                {showAllPresets ? "Show Less" : `Show All (${presets.length})`}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingPresets ? (
            <div className="flex justify-center py-8">
              <motion.div
                className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            </div>
          ) : (
            <AnimatePresence>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(showAllPresets ? presets : presets.slice(0, 3)).map(
                  (preset, index) => (
                    <motion.div
                      key={preset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="h-full"
                    >
                      <Button
                        variant={
                          selectedPreset?.id === preset.id
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handlePresetSelect(preset)}
                        className="text-left justify-start h-full py-4 px-4 w-full min-h-[80px]"
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div
                            className={`flex-shrink-0 ${
                              selectedPreset?.id === preset.id
                                ? "text-white"
                                : "text-slate-500"
                            }`}
                          >
                            {preset.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {preset.name}
                            </div>
                            <div
                              className={`text-xs mt-1 line-clamp-2 ${
                                selectedPreset?.id === preset.id
                                  ? "text-white/80"
                                  : "text-slate-500"
                              }`}
                            >
                              {preset.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  )
                )}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
