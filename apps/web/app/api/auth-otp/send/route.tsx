import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { sendOTPLogin } from "@/lib/mailer";
import VerificationToken from "@/models/verification_token";
import User from "@/models/users";
import { logAccessService } from "@/services/accessService";

const OTP_TTL_MINUTES = 5;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  await logAccessService({
    request: req,
    metadata: { email: email, action: "otp_send" },
  });

  const normalized = email.toLowerCase().trim();
  await dbConnect()

  const checkedEmail = await User.findOne({ email: normalized, active: true });

  if (!checkedEmail) {
    await logAccessService({
      request: req,
      metadata: { action: "OTP SEND", email: email, description: "User is unregistered" },
    })
    return NextResponse.json({ ok: false, error: "Please reach out to our support team. To assists you in activating your account" }, { status: 400 });
  }

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
