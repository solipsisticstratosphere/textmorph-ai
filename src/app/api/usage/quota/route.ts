import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

async function countUserGenerationsLast24h(userId: string) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const used = await prisma.generationUsage.count({
    where: { userId, createdAt: { gte: since } },
  });
  const earliest = await prisma.generationUsage.findFirst({
    where: { userId, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });
  return { used, earliest: earliest?.createdAt ?? null };
}

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (user.isPro) {
      return NextResponse.json(
        {
          isPro: true,
          limit: null,
          used: 0,
          remaining: null,
          nextResetAt: null,
        },
        { status: 200 }
      );
    }

    const DAILY_LIMIT = 50;
    const { used, earliest } = await countUserGenerationsLast24h(user.id);
    const nextResetAt = earliest
      ? new Date(earliest.getTime() + 24 * 60 * 60 * 1000)
      : null;

    return NextResponse.json(
      {
        isPro: false,
        limit: DAILY_LIMIT,
        used,
        remaining: Math.max(0, DAILY_LIMIT - used),
        nextResetAt,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quota GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quota" },
      { status: 500 }
    );
  }
}
