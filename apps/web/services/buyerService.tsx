import dbConnect from "@/lib/mongodb"
import AcceptablePayment from "@/models/acceptable_payments"
import Amortization from "@/models/amortizations"
import Block from "@/models/blocks"
import Lot from "@/models/lots"
import Payment from "@/models/payments"
import Polygon from "@/models/polygons"
import Project from "@/models/projects"
import Realty from "@/models/realties"
import ReceiverAccount from "@/models/receiver_accounts"
import Tag from "@/models/tags"
import User from "@/models/users"

export async function getBuyerLotsService(user_id: string, active: boolean = true) {
    await dbConnect()
    await Project.findOne()
    await Block.findOne()
    await Lot.findOne()
    await Realty.findOne()
    await User.findOne()
    return await Amortization.find({ buyer_ids: user_id, active })
        .populate([
            { path: 'project_id' },
            { path: 'block_id' },
            { path: 'lot_id' },
            { path: 'realty_id' },
            { path: 'agent_id' },
            { path: 'buyer_ids' },
            { path: 'payment_ids' }
        ])
}


export async function getBuyerLotsDueService(user_id: string, active: boolean = true) {
    await dbConnect()
    await Project.findOne()
    await Block.findOne()
    await Lot.findOne()
    return await Amortization.find({ buyer_ids: user_id, active })
        .populate([
            { path: 'project_id', select: "_id name" },
            { path: 'block_id', select: "_id name" },
            { path: 'lot_id', select: "_id name" }
        ]).select("_id project_id block_id lot_id lookup_summary reference_code")
}

export async function getAmortizationService(amortization_id: String, buyer_id: String, populate: any = [
    { path: 'project_id' },
    { path: 'block_id' },
    { path: 'lot_id' },
    { path: 'realty_id' },
    { path: 'agent_id' },
    { path: 'buyer_ids', populate: { path: 'spouse_user_id' } },
    { path: 'buyer_ids.spouse_user_id' },
    { path: 'team_lead' },
    { path: 'team_lead_2' },
    { path: 'agent_id_2' },
    { path: 'tags' }
]) {
    await dbConnect()
    await Project.findOne()
    await Block.findOne()
    await Lot.findOne()
    await Realty.findOne()
    await User.findOne()
    await Payment.findOne()
    await ReceiverAccount.findOne()
    await AcceptablePayment.findOne()
    await Tag.findOne()
    const amortization = await Amortization.findOne({
        _id: amortization_id,
        buyer_ids: buyer_id
    })
        .populate(populate).populate({
            path: 'payment_ids',
            populate: { path: 'receiver_account_id acceptable_payment_id verified_by created_by updated_by' },
            options: { sort: { display_sort: 1 } }
        })
    return amortization
}

export async function getAmortizationLotMapService(amortization_id: String) {
    await dbConnect()

    const amortization = await Amortization.findById(amortization_id).select("project_id")
    const project_id: any = amortization?.project_id
    const project = await Project.findById(project_id).select("project_map_id")

    const query = project?.project_map_id ? {
        project_id: project_id,
        project_map_id: project?.project_map_id || null
    } : {
        project_id: project_id
    }

    const polygons = await Polygon.find(query).select("-createdAt -updatedAt").populate([
        { path: 'project_id' },
        { path: 'block_id' },
        { path: 'lot_id' }
    ])

    let groupPolygon: any = {
        projects: polygons.filter(p => p.type === 'project'),
        blocks: polygons.filter(p => p.type === 'block'),
        lots: polygons.filter(p => p.type === 'lot'),
        others: polygons.filter(p => !['lot', 'block', 'project'].includes(p.type)),
        misc: polygons.filter(p => p.type === 'misc'),
    }

    return groupPolygon
}

export async function getSimilarAmortizationService(amortization_id: String, buyer_id: String) {
    await dbConnect()

    const amortization = await Amortization.findById(amortization_id).select("project_id")
    const similarAmortizations = await Amortization.find({
        _id: { $ne: amortization_id },
        project_id: amortization?.project_id,
        active: true,
        buyer_ids: { $exists: true, $in: [buyer_id] }
    }).select("_id block_id lot_id lookup_summary")

    return similarAmortizations
}
