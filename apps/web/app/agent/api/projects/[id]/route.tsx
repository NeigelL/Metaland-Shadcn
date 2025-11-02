import dbConnect from "@/lib/mongodb";
import { auth, isLogin } from "@/lib/nextAuthOptions";
import { logAccessService } from "@/services/accessService";
import { getAgentProjectDetailService } from "@/services/projectService";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    if (!await isLogin()) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await auth();
    await logAccessService({
        request,
        metadata: { action: "GET PROJECT BY ID", user_id: user?.user_id },
    });

    try {
        // Validate user_id exists
        if (!user?.user_id) {
            return NextResponse.json({ error: "User ID not found" }, { status: 400 });
        }
        // Validate project id param
        const {id: projectId} = await params;
        if (!projectId) {
            return NextResponse.json({ error: "Project ID not provided" }, { status: 400 });
        }

        const result = await getAgentProjectDetailService(projectId);
        if (!result) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching project by id:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}