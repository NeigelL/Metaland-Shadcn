

import dbConnect from "@/lib/mongodb"
import { isLogin } from "@/lib/nextAuthOptions"
import { getBuyerAmortizationSummaryService } from "@/services/buyerService";
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
    await dbConnect()
    const { id } = params
    if(!await isLogin()) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    return NextResponse.json( await getBuyerAmortizationSummaryService(id) )
}