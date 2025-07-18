import dbConnect from "@/lib/mongodb";
import Project from "@/models/projects";


export const projectFields:Record<string, string> = {
    agent: "name address1 address2 region province city barangay zip landmark project_type total_area project_status",
}

export async function getProjectAvailableService() {
    await dbConnect()
    const projects = Project.find({
        "portal.agent": true,
        active: true
    })

    if(projectFields["agent"]) {
        projects.select(projectFields["agent"])
    }

    projects.sort({ createdAt: -1 })
    return await projects
}