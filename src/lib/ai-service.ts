import {
  TransformationRequest,
  TransformationResponse,
  Language,
} from "@/types";

export class AIService {
  private static instance: AIService;
  private apiKey: string | undefined;
  private moonshotKey: string | undefined;

  // Supported languages
  private supportedLanguages: Language[] = [
    { code: "auto", name: "Auto-detect", native_name: "Auto-detect" },
    { code: "en", name: "English", native_name: "English" },
    { code: "ru", name: "Russian", native_name: "Русский" },
    { code: "uk", name: "Ukrainian", native_name: "Українська" },
    { code: "de", name: "German", native_name: "Deutsch" },
    { code: "zh", name: "Chinese", native_name: "中文" },
    { code: "ja", name: "Japanese", native_name: "日本語" },
    { code: "fr", name: "French", native_name: "Français" },
  ];

  private constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || process.env.OPENAI_API_KEY;
    this.moonshotKey = process.env.MOONSHOT_KEY;
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public getSupportedLanguages(): Language[] {
    return this.supportedLanguages;
  }

  // Simple language detection based on character sets
  private detectLanguage(text: string): string {
    // Check for Cyrillic (Russian/Ukrainian)
    if (/[\u0400-\u04FF]/.test(text)) {
      // More Ukrainian-specific characters (і, ї, ґ, є, Є, Ґ)
      if (/[\u0456\u0457\u0491\u0454\u0404\u0490]/.test(text)) {
        return "uk";
      }

      // Count Ukrainian-specific and Russian-specific characters
      const ukSpecific = (
        text.match(/[\u0456\u0457\u0491\u0454\u0404\u0490]/g) || []
      ).length;
      const ruSpecific = (text.match(/[\u044B\u0449\u042B\u0429]/g) || [])
        .length; // ы, щ, Ы, Щ

      // If text contains more Ukrainian-specific characters, it's likely Ukrainian
      if (ukSpecific > 0 && ukSpecific >= ruSpecific) {
        return "uk";
      }

      // Default to Russian for Cyrillic
      return "ru";
    }
    // Check for Chinese
    if (/[\u4E00-\u9FFF]/.test(text)) {
      return "zh";
    }
    // Check for Japanese
    if (/[\u3040-\u30FF\u3400-\u4DBF]/.test(text)) {
      return "ja";
    }
    // Check for German-specific characters
    if (/[\u00C4\u00E4\u00D6\u00F6\u00DC\u00FC\u00DF]/.test(text)) {
      return "de";
    }
    // Check for French-specific characters
    if (
      /[\u00E0\u00E2\u00E7\u00E9\u00EA\u00EB\u00EE\u00EF\u00F4\u00FB\u00FC\u0153]/.test(
        text
      )
    ) {
      return "fr";
    }
    // Default to English
    return "en";
  }

  async transformText(
    request: TransformationRequest
  ): Promise<TransformationResponse> {
    const startTime = Date.now();

    try {
      let transformedText: string;
      let modelUsed: string;

      // Detect input language
      const detectedLanguage = this.detectLanguage(request.input_text);

      // Determine target language
      const targetLanguage =
        request.target_language === "auto" || !request.target_language
          ? detectedLanguage
          : request.target_language;

      // Use Moonshot API if key is available
      if (this.moonshotKey) {
        transformedText = await this.callMoonshotAPI(
          request.input_text,
          request.transformation_instruction,
          request.temperature,
          targetLanguage,
          detectedLanguage
        );
        modelUsed = "moonshot-v1-8k";
      } else {
        // Fallback to mock transformation
        transformedText = await this.mockTransformation(
          request.input_text,
          request.transformation_instruction,
          targetLanguage,
          detectedLanguage
        );
        modelUsed = "mock-model-v1";
      }

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        transformed_text: transformedText,
        model_used: modelUsed,
        processing_time: processingTime,
        token_count: this.estimateTokenCount(
          request.input_text + transformedText
        ),
        detected_language: detectedLanguage,
      };
    } catch (error) {
      return {
        success: false,
        transformed_text: "",
        model_used: this.moonshotKey ? "moonshot-v1-8k" : "mock-model-v1",
        processing_time: Date.now() - startTime,
        token_count: 0,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private async callMoonshotAPI(
    inputText: string,
    instruction: string,
    temperature: number = 0.7,
    targetLanguage: string,
    detectedLanguage: string
  ): Promise<string> {
    if (!this.moonshotKey) {
      throw new Error("Moonshot API key not configured");
    }

    // Build the instruction for combined transformation and translation
    const formattedInstruction = this.buildCombinedInstruction(
      instruction,
      targetLanguage,
      detectedLanguage
    );

    const response = await fetch(
      "https://api.moonshot.cn/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.moonshotKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "moonshot-v1-8k",
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(),
            },
            {
              role: "user",
              content: `${formattedInstruction}\n\nText to transform: ${inputText}`,
            },
          ],
          temperature: temperature || 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Moonshot API request failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    if (
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      throw new Error("Invalid response from Moonshot API");
    }

    return data.choices[0].message.content;
  }

  private getSystemPrompt(): string {
    return `You are a professional text transformer that performs formatting and translation tasks. Follow these rules:

1. ALWAYS apply the formatting/style transformation first
2. ONLY translate if the target language is different from the detected language
3. If translation is needed, translate the FORMATTED text, not the original
4. Never duplicate content in multiple languages
5. Output only the final result in the target language
6. Preserve the meaning and structure while applying the requested formatting
7. If no translation is needed, simply format the text in the original language

Your task is to produce ONE result that combines both formatting and language requirements.`;
  }

  private buildCombinedInstruction(
    instruction: string,
    targetLanguage: string,
    detectedLanguage: string
  ): string {
    const needsTranslation = targetLanguage !== detectedLanguage;
    const targetLangInfo = this.supportedLanguages.find(
      (l) => l.code === targetLanguage
    );

    let formattedInstruction = `Task: ${instruction}`;

    if (needsTranslation && targetLangInfo) {
      formattedInstruction += `\n\nAfter applying the formatting, translate the result to ${targetLangInfo.name} (${targetLangInfo.native_name}).`;
    } else {
      formattedInstruction += `\n\nKeep the text in the original language (${this.getLanguageName(
        detectedLanguage
      )}).`;
    }

    formattedInstruction += `\n\nImportant: Provide only ONE final result that combines both formatting and language requirements. Do not show multiple versions.`;

    return formattedInstruction;
  }

  private getLanguageName(code: string): string {
    const lang = this.supportedLanguages.find((l) => l.code === code);
    return lang ? lang.name : code;
  }

  private async mockTransformation(
    inputText: string,
    instruction: string,
    targetLanguage: string,
    detectedLanguage: string
  ): Promise<string> {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const lowerInstruction = instruction.toLowerCase();
    let transformedText: string;

    // Apply formatting first
    if (
      lowerInstruction.includes("professional") ||
      lowerInstruction.includes("formal") ||
      lowerInstruction.includes("техническ") ||
      lowerInstruction.includes("технічн")
    ) {
      transformedText = this.makeProfessional(inputText, detectedLanguage);
    } else if (
      lowerInstruction.includes("casual") ||
      lowerInstruction.includes("friendly")
    ) {
      transformedText = this.makeCasual(inputText);
    } else if (
      lowerInstruction.includes("bullet") ||
      lowerInstruction.includes("list")
    ) {
      transformedText = this.makeBulletPoints(inputText);
    } else if (
      lowerInstruction.includes("summary") ||
      lowerInstruction.includes("summarize")
    ) {
      transformedText = this.makeSummary(inputText);
    } else if (
      lowerInstruction.includes("expand") ||
      lowerInstruction.includes("detail")
    ) {
      transformedText = this.expandText(inputText);
    } else {
      transformedText = this.genericTransformation(inputText, instruction);
    }

    // Apply translation only if needed
    if (targetLanguage !== detectedLanguage) {
      transformedText = this.mockTranslate(transformedText, targetLanguage);
    }

    return transformedText;
  }

  private mockTranslate(text: string, targetLanguage: string): string {
    const langInfo = this.supportedLanguages.find(
      (l) => l.code === targetLanguage
    );
    const langName = langInfo ? langInfo.name : targetLanguage;

    // Provide more realistic mock translations
    switch (targetLanguage) {
      case "ru":
        return `Техническая документация: Ключевая роль информации в современной жизни

В современном мире информация играет ключевую роль практически во всех аспектах жизни, от образования и бизнеса до медицины и государственного управления. С развитием цифровых технологий объем данных, с которыми сталкивается человек ежедневно, стал огромным.

Фильтрация шума и извлечение сущности

Одной из ключевых задач современных IT-решений является способность фильтровать шум, извлекать суть и представлять информацию в удобной для восприятия форме.

(Примечание: Это имитация перевода на русский язык)`;

      case "uk":
        return `Технічна документація: Ключова роль інформації в сучасному житті

У сучасному світі інформація відіграє ключову роль практично у всіх аспектах життя, від освіти та бізнесу до медицини та державного управління. З розвитком цифрових технологій обсяг даних, з якими стикається людина щоденно, став величезним.

Фільтрація шуму та вилучення сутності

Одним з ключових завдань сучасних IT-рішень є здатність фільтрувати шум, вилучати суть і представляти інформацію у зручній для сприйняття формі.

(Примітка: Це імітація перекладу українською мовою)`;

      case "en":
        return `Technical Documentation: Key Role of Information in Modern Life

In the modern world, information plays a key role in almost all aspects of life, from education and business to medicine and government administration. With the development of digital technologies, the volume of data that a person encounters daily has become enormous.

Filtering Noise and Extracting Essence

One of the key tasks of modern IT solutions is the ability to filter noise, extract essence, and present information in a form convenient for perception.

(Note: This is a mock translation to English)`;

      default:
        return `[${langName} translation] ${text}\n\n(Note: This is a mock translation. In production, this would be properly translated to ${langName})`;
    }
  }

  private makeProfessional(text: string, detectedLanguage: string): string {
    // For Russian/Ukrainian text, apply different transformations
    if (detectedLanguage === "ru" || detectedLanguage === "uk") {
      // Simple cleanup for Cyrillic text - remove extra spaces, fix punctuation
      return text
        .replace(/\s+/g, " ")
        .replace(/\s*:\s*/g, ": ")
        .replace(/\s*;\s*/g, "; ")
        .replace(/\s*,\s*/g, ", ")
        .replace(/\s*\.\s*/g, ". ")
        .replace(/(\w)\s*-\s*(\w)/g, "$1-$2")
        .replace(/\s+([.,:;!?])/g, "$1")
        .trim();
    }

    // For English text
    return text
      .replace(/\bhi\b/gi, "Hello")
      .replace(/\bhey\b/gi, "Hello")
      .replace(/\bthanks\b/gi, "Thank you")
      .replace(/\bokay\b/gi, "Understood")
      .replace(/\bok\b/gi, "Understood")
      .replace(/\byeah\b/gi, "Yes")
      .replace(/\bnope\b/gi, "No")
      .replace(/\bcan't\b/gi, "cannot")
      .replace(/\bwon't\b/gi, "will not")
      .replace(/\bdon't\b/gi, "do not");
  }

  private makeCasual(text: string): string {
    // Simple mock casual transformation
    return (
      text
        .replace(/\bHello\b/gi, "Hey")
        .replace(/\bThank you\b/gi, "Thanks")
        .replace(/\bUnderstood\b/gi, "Got it")
        .replace(/\bcannot\b/gi, "can't")
        .replace(/\bwill not\b/gi, "won't")
        .replace(/\bdo not\b/gi, "don't") + "\n\nCheers!"
    );
  }

  private makeBulletPoints(text: string): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    return sentences.map((sentence) => `• ${sentence.trim()}`).join("\n");
  }

  private makeSummary(text: string): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const keyPoints = sentences.slice(
      0,
      Math.max(1, Math.floor(sentences.length / 3))
    );
    return `Summary:\n\n${keyPoints.map((point) => point.trim()).join(". ")}.`;
  }

  private expandText(text: string): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    return sentences
      .map((sentence) => {
        const trimmed = sentence.trim();
        return `${trimmed}. This point is particularly important because it provides valuable context and helps readers understand the underlying concepts more thoroughly.`;
      })
      .join(" ");
  }

  private genericTransformation(text: string, instruction: string): string {
    return `Transformed text based on instruction: "${instruction}"\n\n${text}\n\n[Note: This is a mock transformation. In production, this would be processed by advanced AI models.]`;
  }

  private estimateTokenCount(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }
}
