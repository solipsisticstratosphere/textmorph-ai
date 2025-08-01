"use client";

import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useTransformationStore } from "@/lib/store";
import type { Language } from "@/types";
import toast from "react-hot-toast";

const InputSection = lazy(() =>
  import("./components/InputSection").then((mod) => ({
    default: mod.InputSection,
  }))
);
const OutputSection = lazy(() =>
  import("./components/OutputSection").then((mod) => ({
    default: mod.OutputSection,
  }))
);
const PresetSelector = lazy(() =>
  import("./components/PresetSelector").then((mod) => ({
    default: mod.PresetSelector,
  }))
);
const TextDashboard = lazy(() =>
  import("./components/TextDashboard").then((mod) => ({
    default: mod.TextDashboard,
  }))
);
const Header = lazy(() =>
  import("./components/Header").then((mod) => ({ default: mod.Header }))
);

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
        toast.error("Failed to load languages. Using default options.");
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

    if (!showDashboard) {
      const { setTextSelection } = useTransformationStore.getState();
      setTextSelection("", -1, -1);
    }

    setShowDashboard(!showDashboard);
  }, [showDashboard, outputText, editableText, setEditableText]);

  useEffect(() => {
    if (!showDashboard && editableText && editableText !== outputText) {
      setOutputText(editableText);
    }
  }, [showDashboard, editableText, outputText, setOutputText]);

  const handleTransform = useCallback(async () => {
    setIsLoading(true);

    try {
      const scrollPosition = window.scrollY;

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
      toast.success("Text transformed successfully!");

      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "instant",
        });
      }, 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
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
      <Suspense
        fallback={
          <div className="h-16 w-full animate-pulse bg-slate-200 rounded-lg"></div>
        }
      >
        <Header />
      </Suspense>

      {/* Dashboard Modal */}
      <Suspense fallback={null}>
        <TextDashboard isOpen={showDashboard} onClose={toggleDashboard} />
      </Suspense>

      {/* Quick Presets */}
      <Suspense
        fallback={
          <div className="h-24 w-full animate-pulse bg-slate-200 rounded-lg"></div>
        }
      >
        <PresetSelector />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse bg-slate-200 rounded-lg"></div>
          }
        >
          <InputSection onTransform={handleTransform} isLoading={isLoading} />
        </Suspense>

        {/* Output Section */}
        <Suspense
          fallback={
            <div className="h-96 w-full animate-pulse bg-slate-200 rounded-lg"></div>
          }
        >
          <OutputSection
            toggleDashboard={toggleDashboard}
            detectedLanguage={detectedLanguage}
            languages={languages}
          />
        </Suspense>
      </div>
    </motion.div>
  );
}
