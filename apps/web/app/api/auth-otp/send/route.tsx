import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { sendOTPLogin } from "@/lib/mailer";
import VerificationToken from "@/models/verification_token";

const OTP_TTL_MINUTES = 10;

function generateCode() {
  // 6-digit numeric, no leading 0 issues:
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const normalized = email.toLowerCase().trim();
  await dbConnect()

  const latest = await VerificationToken.findOne({ identifier: normalized }).sort({ createdAt: -1 });
  if (latest && Date.now() - new Date(latest.createdAt).getTime() < 30_000) {
    return NextResponse.json({ ok: true, throttled: true });
  }

  const code = generateCode();
  const tokenHash = await bcrypt.hash(code, 10);
  const expires = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);

  await VerificationToken.create({
    identifier: normalized,
    tokenHash,
    expires,
  });

  await sendOTPLogin({ email: normalized, code });

  return NextResponse.json({ ok: true });
}
