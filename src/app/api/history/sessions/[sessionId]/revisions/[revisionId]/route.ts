import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: { sessionId: string; revisionId: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { sessionId, revisionId } = context.params;

    const session = await prisma.textSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have access to this session" },
        { status: 403 }
      );
    }

    const revision = await prisma.textRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision || revision.sessionId !== sessionId) {
      return NextResponse.json(
        { error: "Revision not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, revision });
  } catch (error) {
    console.error("Error fetching revision:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { sessionId: string; revisionId: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { sessionId, revisionId } = context.params;
    const data = await request.json();

    const session = await prisma.textSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have access to this session" },
        { status: 403 }
      );
    }

    const revision = await prisma.textRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision || revision.sessionId !== sessionId) {
      return NextResponse.json(
        { error: "Revision not found" },
        { status: 404 }
      );
    }

    const updateData: {
      transformPrompt?: string;
      preset?: string;
    } = {};

    if (data.transformPrompt) {
      updateData.transformPrompt = data.transformPrompt;
    }

    if (data.preset) {
      updateData.preset = data.preset;
    }

    const updatedRevision = await prisma.textRevision.update({
      where: { id: revisionId },
      data: updateData,
    });

    return NextResponse.json({ success: true, revision: updatedRevision });
  } catch (error) {
    console.error("Error updating revision:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { sessionId: string; revisionId: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { sessionId, revisionId } = context.params;

    const session = await prisma.textSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have access to this session" },
        { status: 403 }
      );
    }

    const revision = await prisma.textRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision || revision.sessionId !== sessionId) {
      return NextResponse.json(
        { error: "Revision not found" },
        { status: 404 }
      );
    }

    await prisma.textRevision.delete({
      where: { id: revisionId },
    });

    const remainingRevisions = await prisma.textRevision.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    for (let i = 0; i < remainingRevisions.length; i++) {
      await prisma.textRevision.update({
        where: { id: remainingRevisions[i].id },
        data: { revisionNumber: i + 1 },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting revision:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
