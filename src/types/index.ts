export interface TransformationRequest {
  input_text: string;
  transformation_instruction: string;
  model_preference?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface TransformationResponse {
  success: boolean;
  transformed_text: string;
  model_used: string;
  processing_time: number;
  token_count: number;
  error?: string;
}

export interface TransformationPreset {
  id: string;
  name: string;
  description: string;
  instruction_template: string;
  category: "tone" | "format" | "length";
  icon?: React.ReactNode;
}

export interface TransformationHistory {
  id: string;
  input_text: string;
  output_text: string;
  instruction: string;
  timestamp: Date;
  processing_time: number;
  model_used: string;
}

export interface AppState {
  inputText: string;
  outputText: string;
  instruction: string;
  isLoading: boolean;
  error: string | null;
  history: TransformationHistory[];
  selectedPreset: TransformationPreset | null;
}

export type AppAction =
  | { type: "SET_INPUT_TEXT"; payload: string }
  | { type: "SET_OUTPUT_TEXT"; payload: string }
  | { type: "SET_INSTRUCTION"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_TO_HISTORY"; payload: TransformationHistory }
  | { type: "SET_SELECTED_PRESET"; payload: TransformationPreset | null }
  | { type: "CLEAR_ALL" };

export interface UIState {
  showHistory: boolean;
  showPresets: boolean;
  showTutorial: boolean;
  theme: "light" | "dark";
}

export type UIAction =
  | { type: "TOGGLE_HISTORY" }
  | { type: "TOGGLE_PRESETS" }
  | { type: "TOGGLE_TUTORIAL" }
  | { type: "SET_THEME"; payload: "light" | "dark" };

export interface APIError {
  message: string;
  code: string;
  details?: unknown;
}
