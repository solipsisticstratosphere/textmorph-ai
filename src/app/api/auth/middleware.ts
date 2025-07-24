import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, UserData } from "@/lib/auth";

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: UserData) => Promise<NextResponse>
) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const user = await verifyAccessToken(accessToken);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  return handler(request, user);
}
