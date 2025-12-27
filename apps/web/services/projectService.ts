import dbConnect from "@/lib/mongodb";
import Amortization from "@/models/amortizations";
import Block from "@/models/blocks";
import Lot from "@/models/lots";
import Polygon, { IPolygon } from "@/models/polygons";
import Project from "@/models/projects";


type GroupPolygon = {
    projects: IPolygon[];
    blocks: IPolygon[];
    lots: IPolygon[];
    others: IPolygon[];
    misc: IPolygon[];
}

export const projectFields: Record<string, string> = {
    agent: "name address1 address2 region province city barangay zip landmark project_type total_area project_status",
}

export async function getProjectAvailableService() {
    await dbConnect()

    const projects = Project.find({
        "portal.agent": true,
        active: true
    })

    if (projectFields["agent"]) {
        projects.select(projectFields["agent"])
    }

    projects.sort({ createdAt: -1 })
    const availableProjects: any[] = await projects.lean().exec()
    for (const project of availableProjects) {
        const availableLot = await getProjectBlocksService(project._id.toString());
        project.id = project._id.toString();
        project.total_available_lots = availableLot?.reduce((acc, lot: any) => acc + (lot.availableCounter || 0), 0);
    }

    return availableProjects
}

export async function getAgentProjectDetailService(project_id: string) {
    await dbConnect()

    await Lot.findOne({})
    await Block.findOne({})
    await Amortization.findOne({})

    const project = await Project.findOne({ _id: project_id, "portal.agent": true })
    if (!project) {
        return null
    }
    const query = project?.project_map_id ? {
        project_id: project_id,
        project_map_id: project?.project_map_id || null
    } : {
        project_id: project_id
    }

    const polygons = await Polygon.find(query).select("-createdAt -updatedAt").populate([
        { path: 'lot_id', populate: { path: 'amortization_id', select: 'lookup_summary tags' } },
        { path: 'block_id' }
    ])

    let groupPolygon: GroupPolygon = {
        projects: polygons.filter((p: any) => p.type === 'project'),
        blocks: polygons.filter((p: any) => p.type === 'block'),
        lots: polygons.filter((p: any) => p.type === 'lot'),
        others: polygons.filter((p: any) => !['lot', 'block', 'project'].includes(p.type)),
        misc: polygons.filter((p: any) => p.type === 'misc'),
    }
    return {
        project,
        polygons: groupPolygon
    }
}

export async function getProjectBlocksService(project_id: string) {
    await dbConnect()
    await Lot.findOne()

    const blocks = await Block.find({ project_id: project_id })
        .populate({ path: "availableCounter", select: "name area" })
    return blocks
}

export const getSalesManagerProjectsDashboardService = async () => {
    await dbConnect()
    await Block.findOne()
    await Lot.findOne()

    let projectList = await Project.find({ "portal.salesmanager": true, active: true }).sort({ name: 1 })
    let projects: any = []
    await Promise.all(projectList.map(async (project: any, key: any) => {
        let blocks = 0,
            lots = 0,
            sold = 0,
            onhold = 0,
            available = 0
        let blockList = await Block.find({ project_id: project._id, active: true }).populate('blockLots')

        blocks = blockList.length

        await blockList.map((block: any) => {
            block.blockLots.map(async (lot: any) => {
                lots++
                if (lot.status == "sold") {
                    sold++
                }

                if (lot.status == "onhold") {
                    onhold++
                }

                if (lot.status == "available") {
                    available++
                }
            })
        })

        // const polygons = await Polygon.find({ project_id: { $in: projectList.map((p: any) => p._id) } }).select("-createdAt -updatedAt").populate([
        //     { path: 'lot_id' },
        //     { path: 'block_id' }
        // ])

        // let groupPolygon: GroupPolygon = {
        //     projects: polygons.filter((p: any) => p.type === 'project'),
        //     blocks: polygons.filter((p: any) => p.type === 'block'),
        //     lots: polygons.filter((p: any) => p.type === 'lot'),
        //     others: polygons.filter((p: any) => !['lot', 'block', 'project'].includes(p.type)),
        //     misc: polygons.filter((p: any) => p.type === 'misc'),
        // }

        return projects[key] = {
            _id: project._id,
            name: project.name.toUpperCase(),
            blocks,
            lots,
            sold,
            onhold,
            available,
            // polygons: groupPolygon,
            address: project.address1,
            branch_id: project.branch_id,
            barangay: project.barangay,
            city: project.city,
            region: project.region,
            project_type: project.project_type,
            total_area: project.total_area,
            expected_label: project.expected.label,
        }
    }))

    return projects
}

export async function getSalesManagerProjectDetailService(project_id: string) {
    await dbConnect()

    await Lot.findOne({})
    await Block.findOne({})
    await Amortization.findOne({})

    const project = await Project.findOne({ _id: project_id, "portal.agent": true })
    if (!project) {
        return null
    }
    const query = project?.project_map_id ? {
        project_id: project_id,
        project_map_id: project?.project_map_id || null
    } : {
        project_id: project_id
    }

    const polygons = await Polygon.find(query).select("-createdAt -updatedAt").populate([
        { path: 'lot_id', populate: { path: 'amortization_id', select: 'lookup_summary tags' } },
        { path: 'block_id' }
    ])

    let groupPolygon: GroupPolygon = {
        projects: polygons.filter((p: any) => p.type === 'project'),
        blocks: polygons.filter((p: any) => p.type === 'block'),
        lots: polygons.filter((p: any) => p.type === 'lot'),
        others: polygons.filter((p: any) => !['lot', 'block', 'project'].includes(p.type)),
        misc: polygons.filter((p: any) => p.type === 'misc'),
    }
    return {
        project,
        polygons: groupPolygon
    }
}