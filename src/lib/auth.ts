import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { userId: string, role: string };
    return decoded;
  } catch (error) {
    return null;
  }
}
