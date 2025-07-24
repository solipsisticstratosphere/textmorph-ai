import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  generateAccessToken,
  createSession,
  setAuthCookies,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error("Database error finding user:", dbError);
      return NextResponse.json(
        {
          error: "Database connection error",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    let isPasswordValid;
    try {
      isPasswordValid = await verifyPassword(password, user.password);
    } catch (passwordError) {
      console.error("Password verification error:", passwordError);
      return NextResponse.json(
        {
          error: "Password verification error",
          details:
            passwordError instanceof Error
              ? passwordError.message
              : String(passwordError),
        },
        { status: 500 }
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isPro: user.isPro,
    };

    let accessToken, refreshToken;
    try {
      accessToken = await generateAccessToken(userData);
      refreshToken = await createSession(user.id);
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return NextResponse.json(
        {
          error: "Token generation error",
          details:
            tokenError instanceof Error
              ? tokenError.message
              : String(tokenError),
        },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: userData,
      },
      { status: 200 }
    );

    // Set cookies
    try {
      setAuthCookies(response, accessToken, refreshToken);
    } catch (cookieError) {
      console.error("Cookie setting error:", cookieError);
      return NextResponse.json(
        {
          error: "Cookie setting error",
          details:
            cookieError instanceof Error
              ? cookieError.message
              : String(cookieError),
        },
        { status: 500 }
      );
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "An error occurred during login",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
