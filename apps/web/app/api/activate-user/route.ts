

import dbConnect from "@/lib/mongodb"
import User from "@/models/users";
import { logAccessService } from "@/services/accessService";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
) {
  await dbConnect()
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  await logAccessService({
    request,
    metadata : {email: email, action: "activate_user"},
  });
  const checkUser = await User.findOne({
    email: email, login: true
  })

  if(checkUser) {
    return NextResponse.json({
      success: true,
      message: "User already activated"
    })
  }
  const response = await User.findOneAndUpdate(
    { email, login_code: code, login: false },
    {
      $set: { login: true },
      $addToSet: { roles: "680e3ce332db572507c23337" }
    },
    { new: true }
  )

  return NextResponse.json(
    response ? {
      success: true, message: "User activated successfully"
    } : {
      success: false, message: "User not found or already activated"
    }
  )
}