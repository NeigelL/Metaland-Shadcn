import dbConnect from "@/lib/mongodb"
import AcceptablePayment from "@/models/acceptable_payments"
import Amortization from "@/models/amortizations"
import Block from "@/models/blocks"
import Lot from "@/models/lots"
import Payment from "@/models/payments"
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
    return await Amortization.find({buyer_ids: user_id, active})
    .populate([
        {path:'project_id'},
        {path:'block_id'},
        {path:'lot_id'},
        {path:'realty_id'},
        {path:'agent_id'},
        {path:'buyer_ids'},
        {path:'payment_ids'}
    ])
}


export async function getBuyerLotsDueService(user_id: string, active: boolean = true) {
    await dbConnect()
    const amortizations:any = await getBuyerLotsService(user_id, active)
    const buyerLots:any[] = []

    for(let i = 0; i < amortizations.length; i++) {
        const delayed:any[] = amortizations[i].summary.filter((item:any) => item.isDelayed || item.isWarning )
        if(delayed?.length > 0) {
            buyerLots.push({
                _id:amortizations[i]._id,
                 project_id: amortizations[i].project_id,
                block_id: amortizations[i].block_id,
                lot_id: amortizations[i].lot_id,
                agent_id: amortizations[i].agent_id,
                agent_id_2: amortizations[i].agent_id_2,
                team_lead: amortizations[i].team_lead,
                team_lead_2: amortizations[i].team_lead_2,
                delayed: delayed,
            })
        }
    }

    return buyerLots
}

export async function getAmortizationService(amortization_id: String, buyer_id: String, populate :any = [
    {path:'project_id'},
    {path:'block_id'},
    {path:'lot_id'},
    {path:'realty_id'},
    {path:'agent_id'},
    {path:'buyer_ids', populate:{path:'spouse_user_id'}},
    {path:'buyer_ids.spouse_user_id'},
    {path:'team_lead'},
    {path:'team_lead_2'},
    {path:'agent_id_2'},
    {path: 'tags'}
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
        populate: {path: 'receiver_account_id acceptable_payment_id verified_by created_by updated_by'},
        options: {sort: { display_sort: 1}}
    })
    return amortization
}
