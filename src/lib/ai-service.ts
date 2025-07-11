import { TransformationRequest, TransformationResponse } from "@/types";

export class AIService {
  private static instance: AIService;
  private apiKey: string | undefined;

  private constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || process.env.OPENAI_API_KEY;
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async transformText(
    request: TransformationRequest
  ): Promise<TransformationResponse> {
    const startTime = Date.now();

    try {
      const transformedText = await this.mockTransformation(
        request.input_text,
        request.transformation_instruction
      );

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        transformed_text: transformedText,
        model_used: "mock-model-v1",
        processing_time: processingTime,
        token_count: this.estimateTokenCount(
          request.input_text + transformedText
        ),
      };
    } catch (error) {
      return {
        success: false,
        transformed_text: "",
        model_used: "mock-model-v1",
        processing_time: Date.now() - startTime,
        token_count: 0,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private async mockTransformation(
    inputText: string,
    instruction: string
  ): Promise<string> {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    const lowerInstruction = instruction.toLowerCase();

    if (
      lowerInstruction.includes("professional") ||
      lowerInstruction.includes("formal")
    ) {
      return this.makeProfessional(inputText);
    } else if (
      lowerInstruction.includes("casual") ||
      lowerInstruction.includes("friendly")
    ) {
      return this.makeCasual(inputText);
    } else if (
      lowerInstruction.includes("bullet") ||
      lowerInstruction.includes("list")
    ) {
      return this.makeBulletPoints(inputText);
    } else if (
      lowerInstruction.includes("summary") ||
      lowerInstruction.includes("summarize")
    ) {
      return this.makeSummary(inputText);
    } else if (
      lowerInstruction.includes("expand") ||
      lowerInstruction.includes("detail")
    ) {
      return this.expandText(inputText);
    } else {
      return this.genericTransformation(inputText, instruction);
    }
  }

  private makeProfessional(text: string): string {
    return (
      text
        .replace(/\bhi\b/gi, "Hello")
        .replace(/\bhey\b/gi, "Hello")
        .replace(/\bthanks\b/gi, "Thank you")
        .replace(/\bokay\b/gi, "Understood")
        .replace(/\bok\b/gi, "Understood")
        .replace(/\byeah\b/gi, "Yes")
        .replace(/\bnope\b/gi, "No")
        .replace(/\bcan't\b/gi, "cannot")
        .replace(/\bwon't\b/gi, "will not")
        .replace(/\bdon't\b/gi, "do not") + "\n\nBest regards,"
    );
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

  //
  /*
  private async callHuggingFaceAPI(inputText: string, instruction: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key not configured')
    }

    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${instruction}: ${inputText}`,
        parameters: {
          max_length: 500,
          temperature: 0.7,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.generated_text || data[0]?.generated_text || 'No response generated'
  }
  */
}
