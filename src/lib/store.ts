import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TransformationState {
  inputText: string;
  outputText: string;
  instruction: string;
  editableText: string;
  temperature: number;
  selectedLanguage: string;
  selectedText: string;
  selectionStart: number;
  selectionEnd: number;
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  setInstruction: (instruction: string) => void;
  setEditableText: (text: string) => void;
  setTemperature: (temperature: number) => void;
  setSelectedLanguage: (language: string) => void;
  setTextSelection: (text: string, start: number, end: number) => void;
  clearTextSelection: () => void;
  clearInputText: () => void;
  clearOutputText: () => void;
  clearAll: () => void;
  deactivateSessions: () => Promise<void>;
}

export const useTransformationStore = create<TransformationState>()(
  persist(
    (set) => ({
      inputText: "",
      outputText: "",
      instruction: "",
      editableText: "",
      temperature: 0.7,
      selectedLanguage: "auto",
      selectedText: "",
      selectionStart: -1,
      selectionEnd: -1,
      setInputText: (text) => set({ inputText: text }),
      setOutputText: (text) => set({ outputText: text, editableText: text }),
      setInstruction: (instruction) => set({ instruction }),
      setEditableText: (text) => set({ editableText: text }),
      setTemperature: (temperature) => set({ temperature }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      setTextSelection: (text, start, end) =>
        set({
          selectedText: text,
          selectionStart: start,
          selectionEnd: end,
        }),
      clearTextSelection: () =>
        set({
          selectedText: "",
          selectionStart: -1,
          selectionEnd: -1,
        }),
      clearInputText: () => set({ inputText: "" }),
      clearOutputText: () => {
        set({ outputText: "", editableText: "" });
      },
      clearAll: () => {
        set({
          inputText: "",
          outputText: "",
          instruction: "",
          editableText: "",
          selectedLanguage: "auto",
          selectedText: "",
          selectionStart: -1,
          selectionEnd: -1,
        });
      },
      deactivateSessions: async () => {
        return;
      },
    }),
    {
      name: "transformation-storage",
    }
  )
);
