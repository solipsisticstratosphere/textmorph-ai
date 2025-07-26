import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";
import { TransformationRequest } from "@/types";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

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

function generateSessionTitle(inputText: string, instruction: string): string {
  if (instruction && instruction.length <= 50) {
    return instruction;
  }

  const maxLength = 50;
  let title = inputText.trim().split(/\s+/).slice(0, 5).join(" ");

  if (title.length > maxLength) {
    title = title.substring(0, maxLength - 3) + "...";
  }

  return title || "Untitled Transformation";
}

async function createNewSession(
  userId: string,
  inputText: string,
  instruction: string,
  result: {
    transformed_text: string;
    detected_language?: string;
    temperature?: number;
  }
) {
  await prisma.$executeRaw`
    UPDATE text_sessions 
    SET "isActive" = false 
    WHERE "userId" = ${userId} AND "isActive" = true
  `;

  const session = await prisma.textSession.create({
    data: {
      userId: userId,
      title: generateSessionTitle(inputText, instruction),
      originalText: inputText,
      finalText: result.transformed_text,
      prompt: instruction,
      language: result.detected_language || "auto",
      temperature: result.temperature || 0.7,
    },
  });

  return session.id;
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

    const sanitizedInputText = sanitizeInput(body.input_text);
    const sanitizedInstruction = sanitizeInput(body.transformation_instruction);

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
      input_text: sanitizedInputText,
      transformation_instruction: sanitizedInstruction,
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

    const user = await getAuthUser();

    let currentSessionId = null;

    if (user && result.success) {
      try {
        const sessionId =
          request.cookies.get("currentSessionId")?.value ||
          request.headers.get("x-session-id");

        if (sessionId) {
          const session = await prisma.textSession.findUnique({
            where: { id: sessionId },
          });

          if (session && session.userId === user.id) {
            await prisma.textSession.update({
              where: { id: sessionId },
              data: {
                finalText: result.transformed_text,
                updatedAt: new Date(),
              },
            });
            currentSessionId = sessionId;
          } else {
            currentSessionId = await createNewSession(
              user.id,
              sanitizedInputText,
              sanitizedInstruction,
              result
            );
          }
        } else {
          currentSessionId = await createNewSession(
            user.id,
            sanitizedInputText,
            sanitizedInstruction,
            result
          );
        }
      } catch (error) {
        console.error("Failed to save text session:", error);
      }
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-Frame-Options", "DENY");
    responseHeaders.set("X-XSS-Protection", "1; mode=block");
    responseHeaders.set("Content-Security-Policy", "default-src 'self'");

    const response = NextResponse.json(result, {
      status: 200,
      headers: responseHeaders,
    });

    if (currentSessionId) {
      response.cookies.set("currentSessionId", currentSessionId, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error("Transform API error:", error);

    return NextResponse.json(
      {
        success: false,
        transformed_text: "",
        model_used: "error",
        processing_time: 0,
        token_count: 0,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "Transform API is running",
      endpoints: {
        transform: "POST /api/transform",
      },
    },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
