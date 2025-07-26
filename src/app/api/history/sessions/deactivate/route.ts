import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const result = await prisma.$executeRaw`
      UPDATE text_sessions 
      SET "isActive" = false 
      WHERE "userId" = ${user.id} AND "isActive" = true
    `;

    return NextResponse.json({
      success: true,
      deactivatedCount: result,
    });
  } catch (error) {
    console.error("Error deactivating sessions:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
