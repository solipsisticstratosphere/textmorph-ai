import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { AddTextRevisionRequest } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { sessionId } = await context.params;

    const session = await prisma.textSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to modify this session" },
        { status: 403 }
      );
    }

    const body: AddTextRevisionRequest = await request.json();

    if (
      !body.selectedText ||
      !body.transformedText ||
      !body.transformPrompt ||
      body.startPosition === undefined ||
      body.endPosition === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: selectedText, transformedText, transformPrompt, startPosition, or endPosition",
        },
        { status: 400 }
      );
    }

    const latestRevision = await prisma.textRevision.findFirst({
      where: { sessionId },
      orderBy: { revisionNumber: "desc" },
    });

    const revisionNumber = latestRevision
      ? latestRevision.revisionNumber + 1
      : 1;

    const revision = await prisma.textRevision.create({
      data: {
        sessionId,
        revisionNumber,
        selectedText: body.selectedText,
        transformedText: body.transformedText,
        transformPrompt: body.transformPrompt,
        startPosition: body.startPosition,
        endPosition: body.endPosition,
        preset: body.preset,
      },
    });

    await prisma.textSession.update({
      where: { id: sessionId },
      data: {
        finalText: body.transformedText,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(revision);
  } catch (error) {
    console.error("Error adding revision:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { sessionId } = await context.params;

    const session = await prisma.textSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to access this session" },
        { status: 403 }
      );
    }

    const revisions = await prisma.textRevision.findMany({
      where: { sessionId },
      orderBy: { revisionNumber: "asc" },
    });

    return NextResponse.json({ revisions });
  } catch (error) {
    console.error("Error fetching revisions:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
