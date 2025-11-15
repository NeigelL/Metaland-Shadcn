

import dbConnect from "@/lib/mongodb"
import User from "@/models/users";
import { logAccessService } from "@/services/accessService";
import Email from "next-auth/providers/email";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
) {
  await dbConnect()
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";
  const isBuyer = request.url.includes("buyer");
  const isAgent = request.url.includes("agent");
  const isRealty = request.url.includes("realty");

  const buyerRole = "680e3ce332db572507c23337" // buyer
  const agentRole = "680e3ce332db572507c23338" // agent
  const realtyStaffRole = "680e3ce332db572507c2333a" // realty-staff
  
  let roleID = null

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
  if(isBuyer) {
    roleID = buyerRole
  }
  if(isAgent) {
    roleID = agentRole
  }
  if(isRealty) {
    roleID = realtyStaffRole
  }

  let response = null

  if(code?.indexOf("template_") >= 0) {
    response = null // check on email template if the id exists if so activate the user immediately
    // if(response) {
    //   response = await User.findOneAndUpdate(
    //           { email, login: false },
    //           {
    //             $set: { login: true },
    //             $addToSet: { roles: roleID }
    //           },
    //           { new: true }
    //         )
    // }
  } else {
    response = await User.findOneAndUpdate(
        { email, login_code: code },
        {
          $set: { login: true },
          $addToSet: { roles: roleID }
        },
        { new: true }
      )
  }

  return NextResponse.json(
    response ? {
      success: true, message: "User activated successfully"
    } : {
      success: false, message: "User not found or already activated"
    }
  )
}