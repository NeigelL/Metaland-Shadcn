

import dbConnect from "@/lib/mongodb"
import { getBuyerAmortizationSummaryService } from "@/services/buyerService";
import { NextRequest, NextResponse } from 'next/server'


export async function GET(
  request: NextRequest,
  context: { params: { id: string } } // ✅ This is correct
) {
  const { id } = context.params
  await dbConnect()
    return NextResponse.json(await getBuyerAmortizationSummaryService(id))
}