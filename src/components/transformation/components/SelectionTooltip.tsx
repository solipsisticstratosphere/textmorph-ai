"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Wand2,
  Sparkles as SparkleIcon,
  Maximize2,
  Minimize2,
  X,
  Check,
  Zap,
  Type,
  Coffee,
} from "lucide-react";

interface SelectionTooltipProps {
  position: { x: number; y: number };
  onClose: () => void;
  onTransform: (preset: string) => Promise<void>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  modalContext?: string;
  isInModal?: boolean;
}

// Кастомная кнопка для тултипа
interface TooltipButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "xs";
  disabled?: boolean;
  className?: string;
  title?: string;
}

const TooltipButton = ({
  children,
  onClick,
  variant = "ghost",
  size = "sm",
  disabled = false,
  className = "",
  title,
}: TooltipButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 focus:ring-cyan-400 shadow-md hover:shadow-lg",
    secondary:
      "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 focus:ring-teal-400 shadow-md hover:shadow-lg",
    ghost:
      "text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus:ring-slate-400 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-400 shadow-md hover:shadow-lg",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs h-6",
    sm: "px-3 py-1.5 text-sm h-8",
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      title={title}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.1 }}
    >
      {(variant === "primary" || variant === "secondary") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
        />
      )}
      {children}
    </motion.button>
  );
};

// Global state for tooltip management
export class TooltipManager {
  private static instance: TooltipManager;
  private activeTooltips: Map<string, { close: () => void; isModal: boolean }> =
    new Map();
  private modalOpen = false;

  static getInstance(): TooltipManager {
    if (!TooltipManager.instance) {
      TooltipManager.instance = new TooltipManager();
    }
    return TooltipManager.instance;
  }

  registerTooltip(id: string, closeCallback: () => void, isModal: boolean) {
    // If modal is opening and this is not a modal tooltip, don't register
    if (this.modalOpen && !isModal) {
      return false;
    }

    // If this is a modal tooltip, close all non-modal tooltips
    if (isModal) {
      this.closeAllNonModalTooltips();
      this.modalOpen = true;
    }

    // Close any existing tooltip with the same context
    if (this.activeTooltips.has(id)) {
      this.activeTooltips.get(id)?.close();
    }

    this.activeTooltips.set(id, { close: closeCallback, isModal });
    return true;
  }

  unregisterTooltip(id: string, isModal: boolean) {
    this.activeTooltips.delete(id);

    // If this was a modal tooltip, reset modal state
    if (isModal) {
      this.modalOpen = false;
    }
  }

  closeAllNonModalTooltips() {
    this.activeTooltips.forEach((tooltip, id) => {
      if (!tooltip.isModal) {
        tooltip.close();
        this.activeTooltips.delete(id);
      }
    });
  }

  setModalOpen(open: boolean) {
    this.modalOpen = open;
    if (open) {
      this.closeAllNonModalTooltips();
    }
  }

  isModalOpen(): boolean {
    return this.modalOpen;
  }

  closeAllTooltips() {
    this.activeTooltips.forEach((tooltip) => {
      tooltip.close();
    });
    this.activeTooltips.clear();
    this.modalOpen = false;
  }
}

export function SelectionTooltip({
  position,
  onClose,
  onTransform,
  containerRef,
  modalContext = "default",
  isInModal = false,
}: SelectionTooltipProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipManager = TooltipManager.getInstance();

  useEffect(() => {
    const tooltipId = `${modalContext}-${Date.now()}`;

    const canRegister = tooltipManager.registerTooltip(
      tooltipId,
      onClose,
      isInModal
    );

    if (!canRegister) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);

    return () => {
      tooltipManager.unregisterTooltip(tooltipId, isInModal);
    };
  }, [modalContext, isInModal, onClose]);

  useEffect(() => {
    if (isInModal) {
      tooltipManager.setModalOpen(true);
    }
  }, [isInModal]);

  useEffect(() => {
    if (!shouldRender) return;

    if (isInModal && tooltipRef.current && containerRef?.current) {
      const newPos = { ...position };
      const modalRect = containerRef.current.getBoundingClientRect();
      const tooltipWidth = 280;
      const tooltipHeight = isExpanded ? 300 : 200;

      if (newPos.x - tooltipWidth / 2 < modalRect.left) {
        newPos.x = modalRect.left + tooltipWidth / 2 + 20;
      }

      if (newPos.x + tooltipWidth / 2 > modalRect.right) {
        newPos.x = modalRect.right - tooltipWidth / 2 - 20;
      }

      if (newPos.y - tooltipHeight - 20 < modalRect.top) {
        newPos.y = position.y + 40;
      }

      setAdjustedPosition(newPos);
    } else {
      setAdjustedPosition(position);
    }
  }, [position, isInModal, containerRef, shouldRender, isExpanded]);

  const presets = [
    {
      id: "rephrase",
      label: "Rephrase",
      icon: <Zap className="w-4 h-4" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "expand",
      label: "Expand",
      icon: <Type className="w-4 h-4" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "shorten",
      label: "Shorten",
      icon: <Check className="w-4 h-4" />,
      color: "from-orange-500 to-red-600",
    },
    {
      id: "formal",
      label: "Formal",
      icon: <Coffee className="w-4 h-4" />,
      color: "from-purple-500 to-violet-600",
    },
    {
      id: "casual",
      label: "Casual",
      icon: <SparkleIcon className="w-4 h-4" />,
      color: "from-pink-500 to-rose-600",
    },
    {
      id: "enhance",
      label: "Enhance",
      icon: <SparkleIcon className="w-4 h-4" />,
      color: "from-amber-500 to-yellow-600",
    },
  ];

  const handleTransform = async (preset: string) => {
    try {
      setIsLoading(preset);

      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      await onTransform(preset);

      setTimeout(() => {
        if (range && selection) {
          try {
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (error) {
            // Ignore - selection restoration may fail in certain browser states
          }
        }
        setIsLoading(null);
      }, 100);
    } catch {
      toast.error("Failed to transform text");
      setIsLoading(null);
    }
  };

  const handleTooltipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!shouldRender) {
    return null;
  }

  const getZIndex = () => {
    if (isInModal) {
      return "z-[60000]";
    }
    return "z-[9999]";
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={tooltipRef}
        className={`fixed bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 ${getZIndex()}`}
        style={{
          position: "fixed",
          top: `${adjustedPosition.y}px`,
          left: `${adjustedPosition.x}px`,
          transform: isInModal
            ? "translate(-50%, -100%)"
            : "translate(-50%, calc(-100% - 15px))",
          pointerEvents: "auto",
          minWidth: "280px",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleTooltipClick}
        onMouseDown={(e) => e.preventDefault()}
        data-modal-context={modalContext}
        data-is-modal={isInModal}
      >
        {/* Header */}
        <div className="p-3 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-t-2xl border-b border-white/20 dark:border-slate-600/50">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              AI Transform {isInModal ? "(Modal)" : ""}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipButton
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="xs"
              title={isExpanded ? "Show less" : "Show more"}
              className="w-9 h-9"
            >
              {isExpanded ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </TooltipButton>
            <TooltipButton
              onClick={onClose}
              variant="danger"
              size="xs"
              title="Close"
              className="w-8 h-8"
            >
              <X className="w-6 h-6" />
            </TooltipButton>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {presets.slice(0, 3).map((preset) => (
              <motion.div
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TooltipButton
                  onClick={() => handleTransform(preset.id)}
                  variant={isLoading === preset.id ? "primary" : "secondary"}
                  disabled={isLoading !== null}
                  className="w-full h-10 flex flex-col items-center justify-center space-y-0.5"
                >
                  {isLoading === preset.id ? (
                    <motion.div
                      className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <>
                      <span className="text-sm">{preset.icon}</span>
                      <span className="text-xs font-medium">
                        {preset.label}
                      </span>
                    </>
                  )}
                </TooltipButton>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expanded Options */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="border-t border-white/20 dark:border-slate-600/50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-3">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                  More Options
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {presets.slice(3).map((preset, index) => (
                    <motion.div
                      key={preset.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TooltipButton
                        onClick={() => handleTransform(preset.id)}
                        variant={isLoading === preset.id ? "primary" : "ghost"}
                        disabled={isLoading !== null}
                        className="w-full h-10 flex flex-col items-center justify-center space-y-0.5 border border-slate-200 dark:border-slate-600 hover:border-cyan-300 dark:hover:border-cyan-500"
                      >
                        {isLoading === preset.id ? (
                          <motion.div
                            className="w-3 h-3 border-2 border-cyan-600 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          />
                        ) : (
                          <>
                            <span className="text-sm">{preset.icon}</span>
                            <span className="text-xs font-medium">
                              {preset.label}
                            </span>
                          </>
                        )}
                      </TooltipButton>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip Arrow */}
        <div className="absolute w-4 h-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-l border-white/20 dark:border-slate-700/50 transform rotate-45 left-1/2 bottom-[-8px] -ml-2 shadow-lg"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.6, 0.2, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
