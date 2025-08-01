import { useCallback, useState, useRef, useEffect } from "react";
import { FileText, Edit2, Copy, Download, FileOutput } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { useTransformationStore } from "@/lib/store";
import {
  copyToClipboard,
  downloadText,
  getWordCount,
  getCharacterCount,
} from "@/lib/utils";
import type React from "react";
import toast from "react-hot-toast";
import { TooltipManager } from "./SelectionTooltip";

interface TextDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TextDashboard({ isOpen, onClose }: TextDashboardProps) {
  const { editableText, setEditableText, outputText, setOutputText } =
    useTransformationStore();
  const [isEditing, setIsEditing] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewContainerRef = useRef<HTMLDivElement>(null);

  const tooltipManager = TooltipManager.getInstance();

  const dashboardWordCount = getWordCount(editableText);
  const dashboardCharCount = getCharacterCount(editableText);

  useEffect(() => {
    if (isOpen && outputText && editableText === "") {
      setEditableText(outputText);
    }
  }, [isOpen, outputText, editableText, setEditableText]);

  useEffect(() => {
    tooltipManager.setModalOpen(isOpen);

    return () => {
      if (isOpen) {
        tooltipManager.setModalOpen(false);
      }
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (editableText !== outputText) {
      setOutputText(editableText);
    }
    tooltipManager.setModalOpen(false);
    onClose();
  }, [editableText, outputText, setOutputText, onClose]);

  const handleCopy = useCallback(async () => {
    try {
      await copyToClipboard(editableText);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }, [editableText]);

  const handleDownload = useCallback(() => {
    downloadText(editableText, "transformed-text.txt");
    toast.success("Downloaded text file");
  }, [editableText]);

  const toggleEditing = useCallback(() => {
    setIsEditing(!isEditing);

    // setTooltipPosition(null); // Removed
    // setSelectedText(""); // Removed
    // setSelectionStart(-1); // Removed
    // setSelectionEnd(-1); // Removed

    tooltipManager.closeAllTooltips();
  }, [isEditing]);

  const handleTextareaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditableText(e.target.value);
    },
    [setEditableText]
  );

  // const handleTextSelection = useCallback(
  //   ({ text, start, end }: { text: string; start: number; end: number }) => {
  //     if (!text || start === end) {
  //       // setSelectedText(""); // Removed
  //       // setSelectionStart(-1); // Removed
  //       // setSelectionEnd(-1); // Removed
  //       // setTooltipPosition(null); // Removed
  //       return;
  //     }

  //     console.log(
  //       "Text selected in dashboard:",
  //       text,
  //       "Start:",
  //       start,
  //       "End:",
  //       end
  //     );
  //     // setSelectedText(text); // Removed
  //     // setSelectionStart(start); // Removed
  //     // setSelectionEnd(end); // Released

  //     // if (isEditing && textareaRef.current) { // Removed
  //     //   const textarea = textareaRef.current; // Removed
  //     //   const rect = textarea.getBoundingClientRect(); // Removed

  //     //   const tooltipX = rect.left + rect.width / 2; // Removed
  //     //   const tooltipY = rect.top - 10; // Removed

  //     //   setTooltipPosition({ x: tooltipX, y: tooltipY }); // Removed
  //     // } // Removed
  //   },
  //   [isEditing]
  // );

  // const handleViewModeSelection = useCallback(
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   (e: React.MouseEvent) => {
  //     if (!isEditing) return;

  //     setTimeout(() => {
  //       const selection = window.getSelection();
  //       if (!selection || selection.rangeCount === 0) return;

  //       const selectedText = selection.toString().trim();
  //       if (!selectedText) {
  //         // setTooltipPosition(null); // Removed
  //         // setSelectedText(""); // Removed
  //         return;
  //       }

  //       const range = selection.getRangeAt(0);
  //       const rect = range.getBoundingClientRect();

  //       if (rect.width === 0 && rect.height === 0) return;

  //       // const tooltipX = rect.left + rect.width / 2; // Removed
  //       // const tooltipY = rect.top - 10; // Removed

  //       // setSelectedText(selectedText); // Removed
  //       // setTooltipPosition({ x: tooltipX, y: tooltipY }); // Removed

  //       const fullText = editableText;
  //       const startIndex = fullText.indexOf(selectedText);
  //       if (startIndex !== -1) {
  //         // setSelectionStart(startIndex); // Removed
  //         // setSelectionEnd(startIndex + selectedText.length); // Removed
  //       }
  //     }, 10);
  //   },
  //   [isEditing, editableText]
  // );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // handleCloseTooltip(); // Removed
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handlePdfDownload = useCallback(async () => {
    try {
      setPdfLoading(true);
      const { Document, Page, Text, pdf, StyleSheet, Font } = await import(
        "@react-pdf/renderer"
      );
      const React = await import("react");

      Font.register({
        family: "Roboto",
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      });

      Font.register({
        family: "Roboto-Bold",
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      });

      Font.register({
        family: "Roboto-Italic",
        src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      });

      const styles = StyleSheet.create({
        page: {
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          padding: 40,
          fontFamily: "Roboto",
        },
        section: {
          margin: 10,
          padding: 10,
        },
        text: {
          fontSize: 12,
          lineHeight: 1.5,
          marginBottom: 10,
        },
        bold: {
          fontFamily: "Roboto-Bold",
        },
        italic: {
          fontFamily: "Roboto-Italic",
        },
        link: {
          color: "#0284c7",
          textDecoration: "underline",
        },
        code: {
          fontFamily: "Courier",
          backgroundColor: "#f1f5f9",
          padding: 2,
        },
      });

      // Process markdown in text
      const processMarkdown = (text: string) => {
        // Replace bold: **text** -> text with bold style
        text = text.replace(/\*\*([^*]+)\*\*/g, "{{bold}}$1{{/bold}}");

        // Replace italic: *text* -> text with italic style
        text = text.replace(/\*([^*]+)\*/g, "{{italic}}$1{{/italic}}");

        // Replace code: `text` -> text with code style
        text = text.replace(/`([^`]+)`/g, "{{code}}$1{{/code}}");

        // Replace links: [text](url) -> text with link style (we'll just show the text in PDF)
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "{{link}}$1{{/link}}");

        return text;
      };

      const processText = (text: string) => {
        const processedText = processMarkdown(text);
        return processedText.split("\n").filter((para) => para.trim() !== "");
      };

      const paragraphs = processText(editableText);

      const MyDocument = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            {paragraphs.map((paragraph, i) => {
              const parts = [];
              let currentText = paragraph;
              let currentIndex = 0;

              while (
                currentText.includes("{{bold}}") &&
                currentText.includes("{{/bold}}")
              ) {
                const startIdx = currentText.indexOf("{{bold}}");
                const endIdx = currentText.indexOf("{{/bold}}");

                if (startIdx > 0) {
                  parts.push(
                    <Text key={`text-${i}-${currentIndex++}`}>
                      {currentText.substring(0, startIdx)}
                    </Text>
                  );
                }

                parts.push(
                  <Text key={`bold-${i}-${currentIndex++}`} style={styles.bold}>
                    {currentText.substring(startIdx + 8, endIdx)}
                  </Text>
                );

                currentText = currentText.substring(endIdx + 9);
              }

              const italicParts = [];
              while (
                currentText.includes("{{italic}}") &&
                currentText.includes("{{/italic}}")
              ) {
                const startIdx = currentText.indexOf("{{italic}}");
                const endIdx = currentText.indexOf("{{/italic}}");

                if (startIdx > 0) {
                  italicParts.push(
                    <Text key={`text-${i}-${currentIndex++}`}>
                      {currentText.substring(0, startIdx)}
                    </Text>
                  );
                }

                italicParts.push(
                  <Text
                    key={`italic-${i}-${currentIndex++}`}
                    style={styles.italic}
                  >
                    {currentText.substring(startIdx + 10, endIdx)}
                  </Text>
                );

                currentText = currentText.substring(endIdx + 11);
              }

              const codeParts = [];
              while (
                currentText.includes("{{code}}") &&
                currentText.includes("{{/code}}")
              ) {
                const startIdx = currentText.indexOf("{{code}}");
                const endIdx = currentText.indexOf("{{/code}}");

                if (startIdx > 0) {
                  codeParts.push(
                    <Text key={`text-${i}-${currentIndex++}`}>
                      {currentText.substring(0, startIdx)}
                    </Text>
                  );
                }

                codeParts.push(
                  <Text key={`code-${i}-${currentIndex++}`} style={styles.code}>
                    {currentText.substring(startIdx + 8, endIdx)}
                  </Text>
                );

                currentText = currentText.substring(endIdx + 9);
              }

              const linkParts = [];
              while (
                currentText.includes("{{link}}") &&
                currentText.includes("{{/link}}")
              ) {
                const startIdx = currentText.indexOf("{{link}}");
                const endIdx = currentText.indexOf("{{/link}}");

                if (startIdx > 0) {
                  linkParts.push(
                    <Text key={`text-${i}-${currentIndex++}`}>
                      {currentText.substring(0, startIdx)}
                    </Text>
                  );
                }

                linkParts.push(
                  <Text key={`link-${i}-${currentIndex++}`} style={styles.link}>
                    {currentText.substring(startIdx + 8, endIdx)}
                  </Text>
                );

                currentText = currentText.substring(endIdx + 9);
              }

              if (currentText) {
                if (linkParts.length > 0) {
                  linkParts.push(
                    <Text key={`text-${i}-${currentIndex++}`}>
                      {currentText}
                    </Text>
                  );
                } else if (codeParts.length > 0) {
                  codeParts.push(
                    <Text key={`text-${i}-${currentIndex++}`}>
                      {currentText}
                    </Text>
                  );
                } else if (italicParts.length > 0) {
                  italicParts.push(
                    <Text key={`text-${i}-${currentIndex++}`}>
                      {currentText}
                    </Text>
                  );
                } else if (parts.length > 0) {
                  parts.push(
                    <Text key={`text-${i}-${currentIndex++}`}>
                      {currentText}
                    </Text>
                  );
                }
              }

              if (
                parts.length === 0 &&
                italicParts.length === 0 &&
                codeParts.length === 0 &&
                linkParts.length === 0
              ) {
                return (
                  <Text key={i} style={styles.text}>
                    {paragraph}
                  </Text>
                );
              } else {
                const allParts = [
                  ...parts,
                  ...(italicParts.length > 0 ? italicParts : []),
                  ...(codeParts.length > 0 ? codeParts : []),
                  ...(linkParts.length > 0 ? linkParts : []),
                ];

                return (
                  <Text key={i} style={styles.text}>
                    {allParts}
                  </Text>
                );
              }
            })}
          </Page>
        </Document>
      );

      const pdfBlob = await pdf(<MyDocument />).toBlob();
      const url = URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `transformed-text.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setPdfLoading(false);
    }
  }, [editableText]);

  const formatTextForDisplay = (text: string) => {
    return text.split("\n").map((paragraph, index) => {
      const parts: React.ReactNode[] = [];
      let currentIndex = 0;
      let partIndex = 0;

      const markdownRegex =
        /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;

      let match;
      while ((match = markdownRegex.exec(paragraph)) !== null) {
        if (match.index > currentIndex) {
          parts.push(
            <span key={`text-${partIndex++}`}>
              {paragraph.substring(currentIndex, match.index)}
            </span>
          );
        }

        if (match[1]) {
          parts.push(
            <strong key={`bold-${partIndex++}`} className="font-bold">
              {match[2]}
            </strong>
          );
        } else if (match[3]) {
          parts.push(
            <em key={`italic-${partIndex++}`} className="italic">
              {match[4]}
            </em>
          );
        } else if (match[5]) {
          parts.push(
            <code
              key={`code-${partIndex++}`}
              className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono"
            >
              {match[6]}
            </code>
          );
        } else if (match[7]) {
          parts.push(
            <a
              key={`link-${partIndex++}`}
              href={match[9]}
              className="text-cyan-600 hover:text-cyan-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {match[8]}
            </a>
          );
        }

        currentIndex = match.index + match[0].length;
      }

      if (currentIndex < paragraph.length) {
        parts.push(
          <span key={`text-${partIndex++}`}>
            {paragraph.substring(currentIndex)}
          </span>
        );
      }

      return (
        <p key={index} className={`mb-4 ${index === 0 ? "" : ""}`}>
          {parts.length > 0 ? parts : paragraph || <br />}
        </p>
      );
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Your Text" : "View Transformed Text"}
      headerClassName="bg-gradient-to-r from-cyan-50 to-blue-50"
      footerClassName="bg-gradient-to-r from-slate-50 to-blue-50"
      footer={
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            onClick={toggleEditing}
            className="flex items-center bg-transparent"
          >
            {isEditing ? (
              <>
                <FileText className="w-5 h-5 mr-2" />
                View Mode
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5 mr-2" />
                Edit Mode
              </>
            )}
          </Button>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleCopy}>
              <Copy className="w-5 h-5 mr-2" />
              Copy
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-5 h-5 mr-2" />
              Download as Text
            </Button>
            <Button
              variant="primary"
              onClick={handlePdfDownload}
              isLoading={pdfLoading}
            >
              <FileOutput className="w-5 h-5 mr-2" />
              {pdfLoading ? "Generating..." : "Download as PDF"}
            </Button>
          </div>
        </div>
      }
    >
      <div
        className="flex items-center justify-between mb-4 relative"
        // ref={modalContainerRef} // Removed
      >
        <div className="flex items-center space-x-3">
          <div className="text-sm text-slate-500 bg-white/50 px-3 py-1 rounded-full">
            {dashboardWordCount} words • {dashboardCharCount} characters
          </div>

          {/* Индикатор активного выделения */}
          {/* {selectedText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200"
            >
              <Wand2 className="w-4 h-4 text-cyan-600" />
              <span className="text-sm text-cyan-700 font-medium">
                &quot;
                {selectedText.length > 20
                  ? selectedText.substring(0, 20) + "..."
                  : selectedText}
                &quot; selected
              </span>
            </motion.div>
          )} */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {isEditing ? (
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={editableText}
              onChange={handleTextareaChange}
              className="min-h-[60vh] text-base leading-relaxed p-4 border-0 focus:ring-0 resize-none bg-transparent"
              placeholder="Edit your text here..."
              renderMarkdown={true}
            />

            <div className="text-xs text-slate-500 mt-2">
              Supports Markdown: **bold**, *italic*, `code`, [link](url)
            </div>
          </div>
        ) : (
          <div
            className="prose prose-lg max-w-none text-slate-800 min-h-[60vh] p-4 relative cursor-text"
            ref={viewContainerRef}
            style={{ userSelect: "text" }}
          >
            {formatTextForDisplay(editableText)}
          </div>
        )}
      </div>
    </Modal>
  );
}
