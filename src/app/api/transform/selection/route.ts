import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";
import { SelectionTransformRequest } from "@/types";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sanitizeInput, validateInput } from "@/lib/utils";

async function countUserGenerationsLast24h(userId: string): Promise<number> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return prisma.generationUsage.count({ where: { userId, createdAt: { gte: since } } });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

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

    const selectedTextValidation = validateInput(data.selected_text);
    if (!selectedTextValidation.isValid) {
      return NextResponse.json(
        { success: false, error: selectedTextValidation.error },
        { status: 400 }
      );
    }

    const fullTextValidation = validateInput(data.full_text);
    if (!fullTextValidation.isValid) {
      return NextResponse.json(
        { success: false, error: fullTextValidation.error },
        { status: 400 }
      );
    }

    const presetValidation = validateInput(data.transformation_preset);
    if (!presetValidation.isValid) {
      return NextResponse.json(
        { success: false, error: presetValidation.error },
        { status: 400 }
      );
    }

    const sanitizedSelectedText = sanitizeInput(data.selected_text);
    const sanitizedFullText = sanitizeInput(data.full_text);
    const sanitizedPreset = sanitizeInput(data.transformation_preset);
    const sanitizedTargetLanguage = data.target_language
      ? sanitizeInput(data.target_language)
      : "auto";

    const transformRequest: SelectionTransformRequest = {
      selected_text: sanitizedSelectedText,
      full_text: sanitizedFullText,
      transformation_preset: sanitizedPreset,
      temperature: Math.max(0, Math.min(data.temperature || 0.7, 1)),
      target_language: sanitizedTargetLanguage,
    };


    const authUser = await getAuthUser();
    const DAILY_LIMIT = 50;
    if (authUser && !authUser.isPro) {
      const used = await countUserGenerationsLast24h(authUser.id);
      if (used >= DAILY_LIMIT) {
        return NextResponse.json(
          { success: false, error: "Daily generation limit reached (50 per 24h)." },
          { status: 429 }
        );
      }
    }

    const aiService = AIService.getInstance();
    const result = await aiService.transformSelectedText(transformRequest);

    const user = await getAuthUser();

    let currentSessionId = null;

    if (user && result.success) {
      try {
        const sessionId = data.sessionId || request.headers.get("x-session-id");
        console.log("Selection transform - received session ID:", sessionId);

        if (sessionId) {
          const session = await prisma.textSession.findUnique({
            where: { id: sessionId },
          });

          if (session && session.userId === user.id) {
            console.log(
              "Found valid session, adding revision to session:",
              sessionId
            );

            const latestRevision = await prisma.textRevision.findFirst({
              where: { sessionId: sessionId },
              orderBy: { revisionNumber: "desc" },
            });

            const revisionNumber = latestRevision
              ? latestRevision.revisionNumber + 1
              : 1;

            console.log(
              "Creating revision #",
              revisionNumber,
              "for session:",
              sessionId
            );

            await prisma.textRevision.create({
              data: {
                sessionId: sessionId,
                revisionNumber,
                selectedText: data.selected_text,
                transformedText: result.transformed_selection,
                transformPrompt: data.transformation_preset,
                startPosition: data.start_position || 0,
                endPosition: data.end_position || data.selected_text.length,
                preset: data.transformation_preset,
              },
            });

            await prisma.textSession.update({
              where: { id: sessionId },
              data: {
                finalText:
                  data.full_text.substring(0, data.start_position || 0) +
                  result.transformed_selection +
                  data.full_text.substring(
                    data.end_position || data.selected_text.length
                  ),
                updatedAt: new Date(),
                isActive: true,
              },
            });

            currentSessionId = sessionId;
          } else {
            console.log(
              "Session not found or doesn't belong to user, creating new session"
            );
            currentSessionId = await createNewSession(user.id, data, result);
          }
        } else {
          console.log("No session ID provided, creating new session");
          currentSessionId = await createNewSession(user.id, data, result);
        }
      } catch (error) {
        console.error("Failed to save text revision:", error);
      }

   
      try {
        if (!user.isPro) {
          await prisma.generationUsage.create({
            data: {
              userId: user.id,
              kind: "selection",
            },
          });
        }
      } catch (err) {
        console.error("Failed to record generation usage:", err);
      }
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-Frame-Options", "DENY");
    responseHeaders.set("X-XSS-Protection", "1; mode=block");
    responseHeaders.set("Content-Security-Policy", "default-src 'self'");

    const statusCode = result.success
      ? 200
      : (result.error?.toLowerCase().includes("rate limit") ? 429 : 500);
    const response = NextResponse.json(result, {
      status: statusCode,
      headers: responseHeaders,
    });

    if (currentSessionId) {
      console.log(
        "Selection API - Setting cookie with session ID:",
        currentSessionId
      );
      response.cookies.set("currentSessionId", currentSessionId, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    } else {
      console.log("Selection API - No session ID to set in cookie");
    }

    return response;
  } catch (error) {
    console.error("Selection transformation error:", error);

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("X-Frame-Options", "DENY");
    responseHeaders.set("X-XSS-Protection", "1; mode=block");
    responseHeaders.set("Content-Security-Policy", "default-src 'self'");

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      {
        status: 500,
        headers: responseHeaders,
      }
    );
  }
}

async function createNewSession(
  userId: string,
  data: {
    full_text: string;
    transformation_preset: string;
    selected_text: string;
    start_position?: number;
    end_position?: number;
    target_language?: string;
    temperature?: number;
  },
  result: {
    transformed_selection: string;
  }
) {
  console.log("Selection API - Creating new session for user:", userId);

  const deactivated = await prisma.textSession.updateMany({
    where: {
      userId: userId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  console.log("Selection API - Deactivated sessions:", deactivated.count);

  const startPos = data.start_position || 0;
  const endPos = data.end_position || data.selected_text.length;
  const prefix = data.full_text.substring(0, startPos);
  const suffix = data.full_text.substring(endPos);
  const finalText = prefix + result.transformed_selection + suffix;

  const session = await prisma.textSession.create({
    data: {
      userId: userId,
      title: `${data.transformation_preset} transformation`,
      originalText: data.full_text,
      finalText: finalText,
      prompt: data.transformation_preset,
      language: data.target_language || "auto",
      temperature: Math.max(0, Math.min(data.temperature || 0.7, 1)),
      isActive: true,
    },
  });

  console.log("Selection API - Created new session with ID:", session.id);

  await prisma.textRevision.create({
    data: {
      sessionId: session.id,
      revisionNumber: 1,
      selectedText: data.selected_text,
      transformedText: result.transformed_selection,
      transformPrompt: data.transformation_preset,
      startPosition: startPos,
      endPosition: endPos,
      preset: data.transformation_preset,
    },
  });

  console.log(
    "Selection API - Created first revision for session:",
    session.id
  );

  return session.id;
}
