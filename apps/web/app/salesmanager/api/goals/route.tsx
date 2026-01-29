import dbConnect from "@/lib/mongodb"
import { auth, isLogin } from "@/lib/nextAuthOptions"
import { NextResponse, NextRequest } from "next/server"
import { logAccessService } from "@/services/accessService"
import Amortization from "@/models/amortizations"
import { ObjectId } from "mongodb"



export async function GET(request: NextRequest) {

  await dbConnect()
  if (!await isLogin()) {
    return new NextResponse("Unauthorized", { status: 401 })
  }
  const user = await auth()
  if (user) {
    await logAccessService({
      request,
      metadata: { action: "VIEW GOALS SALESMANAGER", user_id: user?.user_id },
    })
    const amortizations = await Amortization.find({ active: true, sales_manager_id: new ObjectId(user?.user_id) }).select("tcp")
    return NextResponse.json({
      success: true,
      data: {
        sales_target: amortizations.length,
        sales_total_tcp: amortizations.reduce((acc: number, item: any) => acc + item.tcp, 0)
      }
    })
  }
  return NextResponse.json({ success: false })
}