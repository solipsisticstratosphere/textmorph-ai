import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai-service";
import { SelectionTransformRequest } from "@/types";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

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

    const transformRequest: SelectionTransformRequest = {
      selected_text: data.selected_text,
      full_text: data.full_text,
      transformation_preset: data.transformation_preset,
      temperature: data.temperature || 0.7,
      target_language: data.target_language || "auto",
    };

    const aiService = AIService.getInstance();
    const result = await aiService.transformSelectedText(transformRequest);

    const user = await getAuthUser();

    let currentSessionId = null;

    if (user && result.success) {
      try {
        const sessionId = data.sessionId || request.headers.get("x-session-id");

        if (sessionId) {
          const session = await prisma.textSession.findUnique({
            where: { id: sessionId },
          });

          if (session && session.userId === user.id) {
            const latestRevision = await prisma.textRevision.findFirst({
              where: { sessionId: sessionId },
              orderBy: { revisionNumber: "desc" },
            });

            const revisionNumber = latestRevision
              ? latestRevision.revisionNumber + 1
              : 1;

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
              },
            });

            currentSessionId = sessionId;
          } else {
            currentSessionId = await createNewSession(user.id, data, result);
          }
        } else {
          currentSessionId = await createNewSession(user.id, data, result);
        }
      } catch (error) {
        console.error("Failed to save text revision:", error);
      }
    }

    const response = NextResponse.json(result);

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
  await prisma.$executeRaw`
    UPDATE text_sessions 
    SET "isActive" = false 
    WHERE "userId" = ${userId} AND "isActive" = true
  `;

  const session = await prisma.textSession.create({
    data: {
      userId: userId,
      title: `${data.transformation_preset} transformation`,
      originalText: data.full_text,
      finalText:
        data.full_text.substring(0, data.start_position || 0) +
        result.transformed_selection +
        data.full_text.substring(
          data.end_position || data.selected_text.length
        ),
      prompt: data.transformation_preset,
      language: data.target_language || "auto",
      temperature: data.temperature || 0.7,
    },
  });

  await prisma.textRevision.create({
    data: {
      sessionId: session.id,
      revisionNumber: 1,
      selectedText: data.selected_text,
      transformedText: result.transformed_selection,
      transformPrompt: data.transformation_preset,
      startPosition: data.start_position || 0,
      endPosition: data.end_position || data.selected_text.length,
      preset: data.transformation_preset,
    },
  });

  return session.id;
}
