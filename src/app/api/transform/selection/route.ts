import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";
import { SelectionTransformRequest } from "@/types";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate the request
    if (!data.selected_text || !data.full_text || !data.transformation_preset) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: selected_text, full_text, or transformation_preset",
        },
        { status: 400 }
      );
    }

    const transformRequest: SelectionTransformRequest = {
      selected_text: data.selected_text,
      full_text: data.full_text,
      transformation_preset: data.transformation_preset,
      temperature: data.temperature || 0.7,
      target_language: data.target_language || "auto",
    };

    const aiService = AIService.getInstance();
    const result = await aiService.transformSelectedText(transformRequest);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Selection transformation error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
