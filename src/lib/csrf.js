import crypto from "crypto";
import { cookies } from "next/headers";

export async function generateCSRF() {
  const token = crypto.randomBytes(32).toString("hex");
  const cookieStore = await cookies();

  cookieStore.set("csrf_token", token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return token;
}

export async function verifyCSRF(req) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("csrf_token")?.value;
  const headerToken = req.headers.get("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return false;
  }

  return true;
}
