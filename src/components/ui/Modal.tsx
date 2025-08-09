"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  className = "",
  contentClassName = "",
  headerClassName = "",
  footerClassName = "",
  footer,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);

    if (isOpen) {

      scrollPositionRef.current = window.scrollY;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${
        window.innerWidth - document.documentElement.clientWidth
      }px`;

      return () => {
        window.removeEventListener("keydown", handleEscKey);

        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
 
        setTimeout(() => {
          window.scrollTo({
            top: scrollPositionRef.current,
            behavior: "auto",
          });
        }, 0);
      };
    }

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);


  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClickOutside}
        >
          <motion.div
            ref={modalRef}
            className={`bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-white/20 ${className}`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {(title || showCloseButton) && (
              <div
                className={`flex items-center justify-between p-6 border-b border-slate-200/50 bg-gradient-to-r from-cyan-50 to-blue-50 ${headerClassName}`}
              >
                {title && (
                  <h2 className="text-xl font-semibold text-slate-800">
                    {title}
                  </h2>
                )}
                <div className="flex items-center space-x-4">
                  {showCloseButton && (
                    <Button variant="ghost" onClick={onClose}>
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className={`flex-1 overflow-auto p-6 ${contentClassName}`}>
              {children}
            </div>

            {footer && (
              <div
                className={`p-6 border-t border-slate-200/50 ${footerClassName}`}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
