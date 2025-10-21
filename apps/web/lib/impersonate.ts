import crypto from "crypto";
import { cookies as nextCookies } from "next/headers";
import mongoose from "mongoose";
import User from "@/models/users";
import dbConnect from "./mongodb";
import { NextResponse } from "next/server";

const SECRET = process.env.IMPERSONATE_SECRET || "dev-secret";
const COOKIE_EMAIL = "impersonate_email";
const COOKIE_SIG = "impersonate_sig";

export function signEmail(email: string) {
  return crypto.createHmac("sha256", SECRET).update(email).digest("hex");
}

export function verifyEmailSignature(email: string | undefined, sig: string | undefined) {
  if (!email || !sig) return false;
  const expected = signEmail(email);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}

export async function getImpersonatedUser() {
    const ck:any = await nextCookies();
    const emailCookie = await ck.get(COOKIE_EMAIL)
    const email = emailCookie?.value
    const sigCookie = await ck.get(COOKIE_SIG)
    const sig = sigCookie?.value
    if (!verifyEmailSignature(email, sig)) return null;

    if (mongoose.connection.readyState !== 1) {
        await dbConnect()
    }

    if (!email) return null;
    const user = await User.findOne({ email }).lean().exec();
    return user || null;
}
export async function clearImpersonationCookies() {
    await dbConnect()
    const res = NextResponse.json({ ok: true });
    const cookies = await nextCookies();
    cookies.set({ name: "impersonate_email", value: "", maxAge: 0, path: "/" });
    cookies.set({ name: "impersonate_sig", value: "", maxAge: 0, path: "/" });
    return res;
}

export function isImpersonationEnabled(email: string) {
    const impersonateEmails = process.env.NEXT_ADMIN_IMPERSONATE_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || [];
    return impersonateEmails.includes(email.toLowerCase());
}