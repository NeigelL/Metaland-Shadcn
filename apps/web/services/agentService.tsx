import dbConnect from "@/lib/mongodb";
import AcceptablePayment from "@/models/acceptable_payments";
import Amortization from "@/models/amortizations";
import Block from "@/models/blocks";
import Lot from "@/models/lots";
import Payment from "@/models/payments";
import Project from "@/models/projects";
import Realty from "@/models/realties";
import ReceiverAccount from "@/models/receiver_accounts";
import User from "@/models/users";
import Tag from "@/models/tags"
import { ObjectId } from "mongodb"
import BuyerProspect from "@/models/buyer_prospects";
import { auth } from "@/lib/nextAuthOptions";
import { ProspectSourced, ProspectStatus } from "@/types/prospect";
import { updateBuyerProspectTags } from "@/lib/TagHelper";

export async function getAgentEarliestReservation(agent_id: string) {
    await dbConnect()
    return await Amortization.aggregate([
        {
            $match: {
                active: true,
                $expr: {
                    $or: [
                        { $eq: ["$agent_id", new ObjectId(agent_id)] },
                        { $eq: ["$agent_id_2", new ObjectId(agent_id)] },
                        { $eq: ["$team_lead", new ObjectId(agent_id)] },
                        { $eq: ["$team_lead_2", new ObjectId(agent_id)] }
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                earliest_reservation_date: { $min: "$reservation_date" }
            }
        },
        {
            $project: {
                _id: 0,
                earliest_reservation_date: 1
            }
        }
    ])
}

export async function getAgentSummaryAmortization({
    start_date = new Date(),
    end_date = new Date(),
    agent_id = "",
    group_by = "summary"
}: {
    start_date?: Date;
    end_date?: Date;
    agent_id?: string;
    group_by?: "month" | "summary";
}) {
    await dbConnect()
    return await Amortization.aggregate([
        {
            $match: {
                active: true,
                reservation_date: {
                    $gte: start_date,
                    $lte: end_date
                },
                $expr: {
                    $or: [
                        { $eq: ["$agent_id", new ObjectId(agent_id)] },
                        { $eq: ["$agent_id_2", new ObjectId(agent_id)] },
                        { $eq: ["$team_lead", new ObjectId(agent_id)] },
                        { $eq: ["$team_lead_2", new ObjectId(agent_id)] }
                    ]
                }
            }
        },
        {
            $lookup: {
                from: "incentives",
                localField: "_id",
                foreignField: "amortization_id",
                as: "incentives",
                pipeline: [
                    {
                        $match: {
                            deleted: false,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "blocks",
                localField: "block_id",
                foreignField: "_id",
                as: "block",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "lots",
                localField: "lot_id",
                foreignField: "_id",
                as: "lot",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            block_id: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "projects",
                localField: "project_id",
                foreignField: "_id",
                as: "project",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                rice_incentives: {
                    $filter: {
                        input: "$incentives",
                        as: "inc",
                        cond: { $eq: ["$$inc.type", "RICE"] }
                    }
                },
                cash_incentives: {
                    $filter: {
                        input: "$incentives",
                        as: "inc",
                        cond: { $eq: ["$$inc.type", "CASH"] }
                    }
                }
            }
        },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: [group_by, "month"] },
                        { $dateToString: { format: "%b %Y", date: "$reservation_date" } },
                        null
                    ]
                },
                total_lot_sold: { $sum: 1 },
                total_sales: { $sum: "$tcp" },
                total_rice_incentives: {
                    $sum: { $size: "$rice_incentives" }
                },
                total_cash_incentives: {
                    $sum: {
                        $sum: "$cash_incentives.amount"
                    }
                },
                buyers_ids: { $addToSet: "$buyer_ids" },
                amortizations: { $push: {
                    _id: "$_id",
                    lot: "$lot",
                    block: "$block",
                    project: "$project",
                    reservation_date: "$reservation_date",
                    tcp: "$tcp",
                    rice_incentives: "$rice_incentives",
                    cash_incentives: "$cash_incentives",
                    buyer_ids: "$buyer_ids",
                    agent_id: "$agent_id",
                    agent_id_2: "$agent_id_2",
                    team_lead: "$team_lead",
                    team_lead_2: "$team_lead_2",
                    reference_code: "$reference_code",
                } }
            }
        },
        {
            $project: {
                total_lot_sold: 1,
                total_sales: 1,
                total_rice_incentives: 1,
                total_cash_incentives: 1,
                amortizations: 1,
                buyers_ids: {
                    $reduce: {
                        input: "$buyers_ids",
                        initialValue: [],
                        in: {
                            $setUnion: ["$$value", "$$this"]
                        }
                    }
                },
            }
        }
    ])

}


export async function getAgentDueDateAmortization(
    agent_id: string
) {
    await dbConnect()
    await Project.findOne()
    await Block.findOne()
    await Lot.findOne()
    await Realty.findOne()
    await User.findOne()
    await Payment.findOne()

    const amortizations:any = await Amortization.find({
        active: true,
        $or: [
            { agent_id : agent_id },
            { agent_id_2 : agent_id },
            { team_lead : agent_id },
            { team_lead_2 : agent_id },
        ]}).populate([
        {path:'project_id'},
        {path:'block_id'},
        {path:'lot_id'},
        {path: "payment_ids"},
        {path:'buyer_ids', select: 'first_name middle_name last_name fullName phone'},
        {path: 'agent_id', select: 'first_name middle_name last_name fullName phone'},
        {path: 'agent_id_2', select: 'first_name middle_name last_name fullName phone'},
        {path: 'team_lead', select: 'first_name middle_name last_name fullName phone'},
        {path: 'team_lead_2', select: 'first_name middle_name last_name fullName phone'},
    ])
    .select("payment_ids lot_id block_id project_id summary amount tcp buyer_ids agent_id agent_id_2 team_lead team_lead_2 lookup_summary")

    // const agentLots:any[] = []
    // for(let i = 0; i < amortizations.length; i++) {
    //     const delayed = amortizations[i].summary.filter((item:any) => item.isDelayed).map((item:any) => item)
    //     if(delayed?.length > 0 && amortizations[i]) {
    //         agentLots.push({
    //             _id: amortizations[i]._id,
    //             buyer_ids: amortizations[i].buyer_ids,
    //             project_id: amortizations[i].project_id,
    //             block_id: amortizations[i].block_id,
    //             lot_id: amortizations[i].lot_id,
    //             agent_id: amortizations[i].agent_id,
    //             agent_id_2: amortizations[i].agent_id_2,
    //             team_lead: amortizations[i].team_lead,
    //             team_lead_2: amortizations[i].team_lead_2,
    //             delayed: delayed,
    //         })
    //     }
    // }

    return amortizations
}


export async function getAgentAmortizationService(amortization_id: String, agent_id: String, populate :any = [
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
        $or: [
            {agent_id: agent_id},
            {agent_id_2: agent_id},
            {team_lead: agent_id},
            {team_lead_2: agent_id}
        ]
    })
    .populate(populate).populate({
        path: 'payment_ids',
        populate: {path: 'receiver_account_id acceptable_payment_id verified_by created_by updated_by'},
        options: {sort: { display_sort: 1}}
    })
    return amortization
}

export async function getAgentLeadsService(leadId: string) {
    await dbConnect()
    const leads = await BuyerProspect.find({
        created_by: leadId,
        status: { $nin: ProspectStatus.DELETED }
    }).populate({path:'status', select: "name _id"})
    return leads
}

export async function saveAgentLeadService(leadData: any) {
    await dbConnect()
    const existingLead = await checkAgentLeadService(leadData)
    if(existingLead) {
        return { error: "Lead with the same email or phone number already exists." }
    } else {
        const submittedID = "68c4f4a8d443c3af24b040de"
        const user = await auth()
        leadData.created_by = user.id
        leadData.source = ProspectSourced.PORTAL
        const newLead = await BuyerProspect.create(leadData)
        await updateBuyerProspectTags(
            newLead,
            [submittedID],
            [],
            user?.user_id
        )
        return newLead
    }
}

export async function checkAgentLeadService(data: any) {
    await dbConnect()
    const lead = await BuyerProspect.findOne({
        $or: [
            { email: data.email },
            { phone: data.phone }
        ]
    })
    return lead
}

export async function deleteAgentLeadService(leadId: string ) {
    const user = await auth()
    const userId = user.id
    await dbConnect()
    const lead = await BuyerProspect.findOneAndUpdate(
        { _id: leadId, created_by: userId },
        { $push: { status: ProspectStatus.DELETED } },
        { new: true }
    )
}