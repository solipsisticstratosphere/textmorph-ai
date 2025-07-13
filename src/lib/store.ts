import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TransformationState {
  inputText: string;
  outputText: string;
  instruction: string;
  editableText: string;
  temperature: number;
  selectedLanguage: string;
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  setInstruction: (instruction: string) => void;
  setEditableText: (text: string) => void;
  setTemperature: (temperature: number) => void;
  setSelectedLanguage: (language: string) => void;
  clearInputText: () => void;
  clearOutputText: () => void;
  clearAll: () => void;
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
      setInputText: (text) => set({ inputText: text }),
      setOutputText: (text) => set({ outputText: text, editableText: text }),
      setInstruction: (instruction) => set({ instruction }),
      setEditableText: (text) => set({ editableText: text }),
      setTemperature: (temperature) => set({ temperature }),
      setSelectedLanguage: (language) => set({ selectedLanguage: language }),
      clearInputText: () => set({ inputText: "" }),
      clearOutputText: () => set({ outputText: "", editableText: "" }),
      clearAll: () =>
        set({
          inputText: "",
          outputText: "",
          instruction: "",
          editableText: "",
          selectedLanguage: "auto",
        }),
    }),
    {
      name: "transformation-storage",
    }
  )
);
