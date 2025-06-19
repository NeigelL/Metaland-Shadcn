import dbConnect from "@/lib/mongodb"
import Amortization from "@/models/amortizations"
import Block from "@/models/blocks"
import Lot from "@/models/lots"
import Project from "@/models/projects"
import Realty from "@/models/realties"
import User from "@/models/users"

export async function getBuyerLotsService(user_id: string, active: boolean = true) {
    await dbConnect()
    await Project.findOne()
    await Block.findOne()
    await Lot.findOne()
    await Realty.findOne()
    await User.findOne()
    return await Amortization.find({buyer_ids: user_id, active})
    .populate([
        {path:'project_id'},
        {path:'block_id'},
        {path:'lot_id'},
        {path:'realty_id'},
        {path:'agent_id'},
        {path:'buyer_ids'},
    ])
}