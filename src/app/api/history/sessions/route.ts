import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { CreateTextSessionRequest, TextHistoryQueryParams } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body: CreateTextSessionRequest = await request.json();

    if (!body.originalText || !body.prompt || !body.language) {
      return NextResponse.json(
        { error: "Missing required fields: originalText, prompt, or language" },
        { status: 400 }
      );
    }

    const title = body.title || generateTitle(body.originalText);

    const session = await prisma.textSession.create({
      data: {
        userId: user.id,
        title,
        originalText: body.originalText,
        finalText: body.finalText || body.originalText,
        prompt: body.prompt,
        language: body.language,
        temperature: body.temperature || 0.7,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error creating text session:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const params: TextHistoryQueryParams = {
      page: parseInt(url.searchParams.get("page") || "1"),
      limit: parseInt(url.searchParams.get("limit") || "20"),
      search: url.searchParams.get("search") || undefined,
      language: url.searchParams.get("language") || undefined,
      dateFrom: url.searchParams.get("dateFrom") || undefined,
      dateTo: url.searchParams.get("dateTo") || undefined,
    };

    const page = params.page || 1;
    const limit = params.limit || 20;

    type WhereClause = {
      userId: string;
      OR?: Array<{
        [key: string]: { contains: string; mode: "insensitive" };
      }>;
      language?: string;
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    };

    const where: WhereClause = { userId: user.id };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { originalText: { contains: params.search, mode: "insensitive" } },
        { finalText: { contains: params.search, mode: "insensitive" } },
        { prompt: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params.language) {
      where.language = params.language;
    }

    if (params.dateFrom || params.dateTo) {
      where.createdAt = {};

      if (params.dateFrom) {
        where.createdAt.gte = new Date(params.dateFrom);
      }

      if (params.dateTo) {
        where.createdAt.lte = new Date(params.dateTo);
      }
    }

    const total = await prisma.textSession.count({ where });

    const sessions = await prisma.textSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { revisions: { orderBy: { revisionNumber: "asc" } } },
    });

    return NextResponse.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching text sessions:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

function generateTitle(text: string): string {
  const maxLength = 50;
  let title = text.trim().split(/\s+/).slice(0, 5).join(" ");

  if (title.length > maxLength) {
    title = title.substring(0, maxLength - 3) + "...";
  }

  return title || "Untitled Text";
}
