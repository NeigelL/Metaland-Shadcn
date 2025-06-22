

import dbConnect from "@/lib/mongodb"
import { getBuyerAmortizationSummaryService } from "@/services/buyerService";
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
   { params }: { params: any }
) {
  const { id } = params
  await dbConnect()
    return NextResponse.json(await getBuyerAmortizationSummaryService(id))
}