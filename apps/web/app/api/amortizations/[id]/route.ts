

import dbConnect from "@/lib/mongodb"
import { isLogin } from "@/lib/nextAuthOptions"
import { getBuyerAmortizationSummaryService } from "@/services/buyerService";

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
//   request: NextRequest,
  context: { params: { id: string } } // ✅ This is correct
) {
    await dbConnect()

  const { id } = context.params
  return NextResponse.json(await getBuyerAmortizationSummaryService(id))
}