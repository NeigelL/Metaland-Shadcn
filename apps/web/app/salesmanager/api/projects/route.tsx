import dbConnect from "@/lib/mongodb";
import { auth, isLogin } from "@/lib/nextAuthOptions";
import { logAccessService } from "@/services/accessService";
import { getAgentProjectDetailService, getSalesManagerProjectsDashboardService } from "@/services/projectService";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: any }
) {
    await dbConnect();
    if (!await isLogin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await auth();
    await logAccessService({
        request,
        metadata: { action: "GET PROJECTS SALES MANAGER", user_id: user?.user_id },
    });

    try {
        // Validate user_id exists
        if (!user?.user_id) {
            return NextResponse.json({ error: "User ID not found" }, { status: 400 });
        }

        const result = await getSalesManagerProjectsDashboardService();
        if (!result) {
            return NextResponse.json({ error: "Projects not found" }, { status: 404 });
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}