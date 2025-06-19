

import dbConnect from "@/lib/mongodb"
import { isLogin } from "@/lib/nextAuthOptions"
import { getBuyerAmortizationSummaryService } from "@/services/buyerService";
import { NextRequest, NextResponse } from "next/server"

const getAmortizationRoute = async(
      request: NextRequest,
  { params }: { params: { id: any } }
) => {
    await dbConnect()

     const { id } = params

    if(!await isLogin()) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    return NextResponse.json( await getBuyerAmortizationSummaryService(id) )
}

export {
    getAmortizationRoute as GET,
}