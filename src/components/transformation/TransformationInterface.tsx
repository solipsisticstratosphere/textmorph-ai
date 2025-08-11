"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTransformationStore } from "@/lib/store";
import type { Language } from "@/types";
import { InputSection } from "./components/InputSection";
import { OutputSection } from "./components/OutputSection";
import { PresetSelector } from "./components/PresetSelector";
import { TextDashboard } from "./components/TextDashboard";
import { Header } from "./components/Header";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";

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

  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);


  const [showGuestWarningModal, setShowGuestWarningModal] = useState(false);
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);
  const [guestGenerationCount, setGuestGenerationCount] = useState(0);

  const FREE_GENERATION_LIMIT = 5;
  const WARNING_AFTER_COUNT = 3;


  useEffect(() => {
    if (!user) {
      const count = Number.parseInt(
        (typeof window !== "undefined" && localStorage.getItem("guestGenerationCount")) ||
          "0",
        10
      );
      setGuestGenerationCount(Number.isFinite(count) ? count : 0);
    } else {
      setGuestGenerationCount(0);
    }
  }, [user]);

  const isGuestLimitReached = !user && guestGenerationCount >= FREE_GENERATION_LIMIT;

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

      if (!user) {
        const currentCount = Number.parseInt(
          (typeof window !== "undefined" && localStorage.getItem("guestGenerationCount")) ||
            "0",
          10
        );
        if (currentCount >= FREE_GENERATION_LIMIT) {
          setShowGuestLimitModal(true);
          setIsLoading(false);
          return;
        }
      }

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

      
      if (response.status === 429 && user && !user.isPro) {
       
        try {
          const body = await response.json();
          const message = (body?.error || "").toString().toLowerCase();
          if (message.includes("provider rate limit") || message.includes("rate limit")) {
            toast("Too many requests to the AI provider. Please try again in a moment.");
          } else {
            toast("You've reached your daily generation limit. Upgrade to Pro to continue.");
          }
        } catch {
          toast("You've reached your daily generation limit. Upgrade to Pro to continue.");
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Transformation failed");
      }

      setOutputText(data.transformed_text);
      if (data.detected_language) {
        setDetectedLanguage(data.detected_language);
      }
      toast.success("Text transformed successfully!");


      if (!user) {
        const currentCount = Number.parseInt(
          (typeof window !== "undefined" && localStorage.getItem("guestGenerationCount")) ||
            "0",
          10
        );
        const newCount = currentCount + 1;
        localStorage.setItem("guestGenerationCount", String(newCount));
        setGuestGenerationCount(newCount);
        if (newCount === WARNING_AFTER_COUNT) {
          setShowGuestWarningModal(true);
        }
        if (newCount >= FREE_GENERATION_LIMIT) {
          toast("You have used all 5 free generations.");
        }
      } else if (user && !user.isPro) {

        window.dispatchEvent(new Event("quota:update"));
      }

      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "auto",
        });
      }, 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user, inputText, instruction, temperature, selectedLanguage, setOutputText]);

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
      <TextDashboard isOpen={showDashboard} onClose={toggleDashboard} />

      {/* Quick Presets */}
      <PresetSelector />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <InputSection
          onTransform={handleTransform}
          isLoading={isLoading}
          isGuestLimitReached={isGuestLimitReached}
        />

        {/* Output Section */}
        <OutputSection
          toggleDashboard={toggleDashboard}
          detectedLanguage={detectedLanguage}
          languages={languages}
          onGuestWarning={() => setShowGuestWarningModal(true)}
          onGuestLimit={() => setShowGuestLimitModal(true)}
          freeLimit={FREE_GENERATION_LIMIT}
          warningAfterCount={WARNING_AFTER_COUNT}
        />
      </div>

      {/* Guest warning modal after 3rd generation */}
      <Modal
        isOpen={showGuestWarningModal}
        onClose={() => setShowGuestWarningModal(false)}
        title="You have used 3 free generations"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowGuestWarningModal(false)}>
              Continue
            </Button>
            <Link href="/login">
              <Button variant="primary">Sign in</Button>
            </Link>
          </div>
        }
      >
        <p className="text-slate-700">
          Guests have access to 5 text generations. You have 2 remaining. Sign in to lift the limit.
        </p>
      </Modal>

      {/* Guest hard limit modal at 5 */}
      <Modal
        isOpen={showGuestLimitModal}
        onClose={() => setShowGuestLimitModal(false)}
        title="Free generation limit reached"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowGuestLimitModal(false)}>
              Close
            </Button>
            <Link href="/login">
              <Button variant="primary">Sign in</Button>
            </Link>
          </div>
        }
      >
        <p className="text-slate-700">
          You have reached the limit of 5 free generations available to guests. Sign in or register to continue without limits.
        </p>
      </Modal>
    </motion.div>
  );
}
