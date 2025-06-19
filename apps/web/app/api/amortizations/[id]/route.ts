

import dbConnect from "@/lib/mongodb"
import { isLogin } from "@/lib/nextAuthOptions"
import { getBuyerAmortizationSummaryService } from "@/services/buyerService";
import { NextRequest, NextResponse } from "next/server"

const getAmortizationRoute = async(
    req: NextRequest, { params } : {params: {id: string}}
) => {
    await dbConnect()

    if(!await isLogin()) {
        return new NextResponse("Unauthorized", {status: 401})
    }

    return NextResponse.json( await getBuyerAmortizationSummaryService(params.id) )
}

export {
    getAmortizationRoute as GET,
}