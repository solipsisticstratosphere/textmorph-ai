import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";
import { TransformationRequest } from "@/types";

export const dynamic = "force-dynamic";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : request.headers.get("x-real-ip");
  return ip || "anonymous";
}

function checkRateLimit(key: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime };
  }

  current.count++;
  return { allowed: true };
}

function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .trim();
}

function verifyCsrfToken(request: NextRequest): boolean {
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!referer || !host) {
    return false;
  }

  try {
    const refererUrl = new URL(referer);
    return refererUrl.host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrfToken(request)) {
      return NextResponse.json(
        { error: "CSRF validation failed" },
        { status: 403 }
      );
    }

    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetTime: rateLimit.resetTime,
        },
        { status: 429 }
      );
    }

    let body: TransformationRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!body.input_text || !body.transformation_instruction) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: input_text and transformation_instruction",
        },
        { status: 400 }
      );
    }

    if (body.input_text.length > 10000) {
      return NextResponse.json(
        { error: "Input text too long. Maximum 10,000 characters allowed." },
        { status: 400 }
      );
    }

    if (body.transformation_instruction.length > 500) {
      return NextResponse.json(
        {
          error:
            "Transformation instruction too long. Maximum 500 characters allowed.",
        },
        { status: 400 }
      );
    }

    const aiService = AIService.getInstance();
    const supportedLanguages = aiService
      .getSupportedLanguages()
      .map((lang) => lang.code);

    if (
      body.target_language &&
      body.target_language !== "auto" &&
      !supportedLanguages.includes(body.target_language)
    ) {
      return NextResponse.json(
        {
          error: `Unsupported target language: ${
            body.target_language
          }. Supported languages: ${supportedLanguages.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const sanitizedRequest: TransformationRequest = {
      input_text: sanitizeInput(body.input_text),
      transformation_instruction: sanitizeInput(
        body.transformation_instruction
      ),
      model_preference: body.model_preference || "default",
      max_tokens: Math.min(body.max_tokens || 1000, 2000),
      temperature: Math.max(0, Math.min(body.temperature || 0.7, 1)),
      target_language: body.target_language || "auto",
    };

    const result = await aiService.transformText(sanitizedRequest);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Transformation failed" },
        { status: 500 }
      );
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-Frame-Options", "DENY");
    responseHeaders.set("X-XSS-Protection", "1; mode=block");
    responseHeaders.set("Content-Security-Policy", "default-src 'self'");

    return NextResponse.json(result, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Transform API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "application/json");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("X-Frame-Options", "DENY");
  responseHeaders.set("X-XSS-Protection", "1; mode=block");
  responseHeaders.set("Content-Security-Policy", "default-src 'self'");

  return NextResponse.json(
    {
      message: "TextMorph AI Transform API",
      version: "1.0.0",
      endpoints: {
        POST: "/api/transform - Transform text with AI",
      },
    },
    {
      headers: responseHeaders,
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
    },
  });
}
