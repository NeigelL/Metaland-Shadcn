import dbConnect from "@/lib/mongodb";
import Block from "@/models/blocks";
import Lot from "@/models/lots";
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
    const availableProjects:any[] = await projects.lean().exec()
    for (const project of availableProjects) {
        const availableLot = await getProjectBlocksService(project._id.toString());
        project.id = project._id.toString();
        project.total_available_lots = availableLot?.reduce((acc, lot:any) => acc + (lot.availableCounter || 0), 0);
    }

    return availableProjects
}

export async function getProjectBlocksService(project_id: string) {
    await dbConnect()
    await Lot.findOne()

    const blocks = await Block.find({ project_id: project_id })
        .populate({ path: "availableCounter", select: "name area" })
    return blocks
}