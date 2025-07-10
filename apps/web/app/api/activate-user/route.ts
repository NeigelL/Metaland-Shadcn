

import dbConnect from "@/lib/mongodb"
import { auth } from "@/lib/nextAuthOptions";
import User from "@/models/users";
import { getAmortizationService } from "@/services/buyerService";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
) {
  await dbConnect()
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";
  const response = await User.findOneAndUpdate({ email, login_code: code }, { $set: {login: true, roles: ["680e3ce332db572507c23337"] } }, { new: true })
  return NextResponse.json(
    response ? { success: true, message: "User activated successfully" } : { success: false, message: "User not found or already activated" },
  )
}