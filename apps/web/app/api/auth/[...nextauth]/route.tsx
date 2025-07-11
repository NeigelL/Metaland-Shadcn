import nextInstance from "@/lib/nextAuthOptions";
import { logAccessService } from "@/services/accessService";
import NextAuth from "next-auth/next";
import { NextRequest } from "next/server";

const nextAuthInstance = NextAuth(nextInstance)
export async function GET(request: NextRequest, context: any) {
      await logAccessService({
        request,
        metadata : { action: "LOGIN GET"},
      })
    return nextAuthInstance(request, context)
}

export async function POST(request: NextRequest, context: any) {
    const postData = {
        params: context?.params
    };
    await logAccessService({
        request,
        metadata: { action: "LOGIN POST", ...postData }
    })
    return nextAuthInstance(request, context);
}
