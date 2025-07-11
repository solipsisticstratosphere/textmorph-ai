"use client";

import { useState, useCallback } from "react";
import {
  Wand2,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  Zap,
  FileText,
  MessageSquare,
  List,
  Expand,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  copyToClipboard,
  downloadText,
  validateInput,
  getWordCount,
  getCharacterCount,
} from "@/lib/utils";
import type { TransformationPreset } from "@/types";

const PRESET_TRANSFORMATIONS: TransformationPreset[] = [
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

export function TransformationInterface() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [instruction, setInstruction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] =
    useState<TransformationPreset | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handlePresetSelect = useCallback((preset: TransformationPreset) => {
    setSelectedPreset(preset);
    setInstruction(preset.instruction_template);
  }, []);

  const handleTransform = useCallback(async () => {
    const validation = validateInput(inputText);
    if (!validation.isValid) {
      setError(validation.error || "Invalid input");
      return;
    }

    if (!instruction.trim()) {
      setError("Please provide transformation instructions");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input_text: inputText,
          transformation_instruction: instruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Transformation failed");
      }

      setOutputText(data.transformed_text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, instruction]);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(outputText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  }, [outputText]);

  const handleDownload = useCallback(() => {
    downloadText(outputText, "transformed-text.txt");
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText("");
    setOutputText("");
    setInstruction("");
    setSelectedPreset(null);
    setError(null);
  }, []);

  const inputWordCount = getWordCount(inputText);
  const inputCharCount = getCharacterCount(inputText);
  const outputWordCount = getWordCount(outputText);
  const outputCharCount = getCharacterCount(outputText);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Header */}
      <div className="text-center mb-12 fade-in">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          Transform Your Text with{" "}
          <span className="gradient-text">AI Magic</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Simply paste your text, specify how you want it transformed, and let
          our AI do the work. Experience the power of intelligent text
          transformation.
        </p>
      </div>

      {/* Quick Presets */}
      <Card variant="glass" className="mb-8 slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>Quick Transformations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PRESET_TRANSFORMATIONS.map((preset) => (
              <Button
                key={preset.id}
                variant={
                  selectedPreset?.id === preset.id ? "primary" : "outline"
                }
                size="sm"
                onClick={() => handlePresetSelect(preset)}
                className="text-left justify-start h-auto py-4 px-4 hover-lift"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 ${
                      selectedPreset?.id === preset.id
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {preset.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{preset.name}</div>
                    <div
                      className={`text-xs mt-1 ${
                        selectedPreset?.id === preset.id
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {preset.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card variant="elevated" className="slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Input Text</span>
              <div className="flex items-center space-x-2 text-sm text-gray-500 font-normal">
                <span>•</span>
                <span>{inputWordCount} words</span>
                <span>•</span>
                <span>{inputCharCount} characters</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              placeholder="Paste or type your text here... ✨"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              className="min-h-[300px] text-base leading-relaxed"
            />

            <Input
              placeholder="Describe how you want to transform the text... 🎯"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="text-base"
            />

            <div className="flex space-x-3">
              <Button
                onClick={handleTransform}
                disabled={!inputText.trim() || !instruction.trim() || isLoading}
                isLoading={isLoading}
                className="flex-1 text-base py-3"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {isLoading ? "Transforming..." : "Transform Text"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isLoading}
                className="px-4 bg-transparent"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card variant="elevated" className="slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Transformed Text</span>
              {outputText && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 font-normal">
                  <span>•</span>
                  <span>{outputWordCount} words</span>
                  <span>•</span>
                  <span>{outputCharCount} characters</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              placeholder="Your transformed text will appear here... ✨"
              value={outputText}
              readOnly
              rows={12}
              className="min-h-[300px] bg-gray-50/50 text-base leading-relaxed"
            />

            {outputText && (
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleCopy}
                  className="flex-1 text-base py-3"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  {copySuccess ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="px-4 bg-transparent"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Card
          variant="default"
          className="mt-8 border-red-200 bg-red-50/50 scale-in"
        >
          <CardContent>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
