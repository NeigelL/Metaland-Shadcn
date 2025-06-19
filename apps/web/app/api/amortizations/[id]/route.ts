

import dbConnect from "@/lib/mongodb"
import { getBuyerAmortizationSummaryService } from "@/services/buyerService";
import { NextRequest, NextResponse } from 'next/server'


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params
  await dbConnect()
    return NextResponse.json(await getBuyerAmortizationSummaryService(id))
}