import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const aiService = AIService.getInstance();
    const languages = aiService.getSupportedLanguages();

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-Frame-Options", "DENY");
    responseHeaders.set("X-XSS-Protection", "1; mode=block");
    responseHeaders.set("Content-Security-Policy", "default-src 'self'");

    return NextResponse.json(
      {
        success: true,
        languages,
        total: languages.length,
      },
      {
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error("Languages API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  });
}
