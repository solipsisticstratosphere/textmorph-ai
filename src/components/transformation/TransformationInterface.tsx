"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTransformationStore } from "@/lib/store";
import type { Language } from "@/types";
import { InputSection } from "./components/InputSection";
import { OutputSection } from "./components/OutputSection";
import { PresetSelector } from "./components/PresetSelector";
import { TextDashboard } from "./components/TextDashboard";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { Header } from "./components/Header";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export function TransformationInterface() {
  const {
    inputText,
    outputText,
    instruction,
    editableText,
    temperature,
    selectedLanguage,
    setOutputText,
    setEditableText,
  } = useTransformationStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);

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
      }
    };

    fetchLanguages();
  }, []);

  const toggleDashboard = useCallback(() => {
    if (!showDashboard && outputText && editableText === "") {
      setEditableText(outputText);
    }
    setShowDashboard(!showDashboard);
  }, [showDashboard, outputText, editableText, setEditableText]);

  const handleTransform = useCallback(async () => {
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
          temperature: temperature,
          target_language: selectedLanguage,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Transformation failed");
      }

      setOutputText(data.transformed_text);
      if (data.detected_language) {
        setDetectedLanguage(data.detected_language);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, instruction, temperature, selectedLanguage, setOutputText]);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <Header />

      {/* Dashboard Modal */}
      <TextDashboard
        isOpen={showDashboard}
        onClose={toggleDashboard}
        copySuccess={copySuccess}
        setCopySuccess={setCopySuccess}
      />

      {/* Quick Presets */}
      <PresetSelector />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <InputSection
          onTransform={handleTransform}
          isLoading={isLoading}
          setError={setError}
        />

        {/* Output Section */}
        <OutputSection
          copySuccess={copySuccess}
          setCopySuccess={setCopySuccess}
          toggleDashboard={toggleDashboard}
          detectedLanguage={detectedLanguage}
          languages={languages}
        />
      </div>

      {/* Error Display */}
      <ErrorDisplay error={error} />
    </motion.div>
  );
}
