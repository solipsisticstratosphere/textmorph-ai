import bcrypt from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { NextRequest, NextResponse } from "next/server";

// Constants
const SALT_ROUNDS = 10;
const ACCESS_TOKEN_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET || "access_token_secret"
);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret"
);
const ACCESS_TOKEN_EXPIRY = "30m"; // 30 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

// Types
export interface UserData {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  [key: string]: string | boolean;
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Token utilities
export async function generateAccessToken(user: UserData): Promise<string> {
  return new jose.SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(ACCESS_TOKEN_SECRET);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  return new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<UserData | null> {
  try {
    const { payload } = await jose.jwtVerify(token, ACCESS_TOKEN_SECRET);
    return payload as unknown as UserData;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, REFRESH_TOKEN_SECRET);
    return payload as unknown as { userId: string };
  } catch {
    return null;
  }
}

// Session management
export async function createSession(userId: string): Promise<string> {
  const token = await generateRefreshToken(userId);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function validateSession(token: string): Promise<string | null> {
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.userId;
}

export async function deleteSession(token: string): Promise<void> {
  await prisma.session.delete({
    where: { token },
  });
}

// Auth middleware
export async function getAuthUser(): Promise<UserData | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  const tokenData = await verifyAccessToken(accessToken);
  if (!tokenData) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: tokenData.id },
    select: {
      id: true,
      name: true,
      email: true,
      isPro: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function refreshAccessToken(
  request: NextRequest
): Promise<NextResponse | null> {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return null;
  }

  const userId = await validateSession(refreshToken);
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      isPro: true,
    },
  });

  if (!user) {
    return null;
  }

  const accessToken = await generateAccessToken(user);

  const response = NextResponse.next();
  response.cookies.set("accessToken", accessToken, COOKIE_OPTIONS);

  return response;
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  response.cookies.set("accessToken", accessToken, COOKIE_OPTIONS);
  response.cookies.set("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }); // 7 days
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set("accessToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set("refreshToken", "", { ...COOKIE_OPTIONS, maxAge: 0 });
}
