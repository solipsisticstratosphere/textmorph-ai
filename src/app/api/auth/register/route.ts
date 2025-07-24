import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  generateAccessToken,
  createSession,
  setAuthCookies,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        isPro: false,
      },
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isPro: user.isPro,
    };

    const accessToken = await generateAccessToken(userData);
    const refreshToken = await createSession(user.id);

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: userData,
      },
      { status: 201 }
    );

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
