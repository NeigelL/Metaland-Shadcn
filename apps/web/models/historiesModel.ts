import { auth } from "@/lib/nextAuthOptions";
import { serverFormatDate } from "@/lib/server_functions";
import { LotHistoryAction, TABLE } from "@/serverConstant";
import History from "./histories";
import { getUserService } from "@/services/userService";
import Lot from "./lots";

interface IHistory {
    table: String,
    entity_id:String,
    action: number,
    description: String,
    before: {},
    after: {},
    summaries?: String
}

export async function createHistory(params:IHistory) {
    const {
        entity_id = "",
        table =   "",
        before = {},
        action = "",
        after = {},
        description = "GENERIC DESCRIPTION",
        summaries = ""
    } = params
    const user = await auth()
    return await History.create({
        created_by : user?.user_id,
        entity_id : entity_id,
        table : table,
        action : action,
        description : description,
        before: {...before},
        after: {...after},
        summaries: summaries,
    })
}

export async function createdLotHistory(lot_id: string, newState:any) {
    const lot = await Lot.findById(lot_id)
    const user = await getUserService(lot?.created_by)
    let summaries:string[] = []
    summaries.push("Lot created at")
    summaries.push(serverFormatDate(new Date(), "yyyy-MM-dd H:i:s"))
    summaries.push("by " + user?.first_name +" " + user?.middle_name + " " + user?.last_name)

    return await createHistory({
        entity_id: lot_id,
        table: TABLE.LOTS,
        action : LotHistoryAction.CREATED,
        description : "LOT CREATED",
        before: {...lot},
        after: {...newState},
        summaries: summaries.join(" ")
    })
}

export async function updatedLotHistory(lot_id: string, newState:any, description = "LOT UPDATED", summaries:any = "" ) {
    const lot = await Lot.findById(lot_id)
    return await createHistory({
        entity_id: lot_id,
        table: TABLE.LOTS,
        action : LotHistoryAction.CREATED,
        description : description,
        before: {...lot},
        after: {...newState},
        summaries: summaries
    })
}

export async function amortizationCreatedLotHistory(lot_id: string, newState:any, description = "AMORTIZATION CREATED" ) {
    let summaries:string[] = []
    const user = await getUserService(newState.created_by)
    summaries.push("Amortization created at")
    summaries.push(serverFormatDate(new Date(), "yyyy-MM-dd H:i:s"))
    summaries.push("by " + user?.first_name +" " + user?.middle_name + " " + user?.last_name)
    return await updatedLotHistory(lot_id, newState, description, summaries.join(" ") )
}

export async function amortizationUpdatedLotHistory(lot_id: string, newState:any, description = "AMORTIZATION UPDATED" ) {
    let summaries:string[] = []
    summaries.push("Amortization updated at")
    summaries.push(serverFormatDate(new Date(), "yyyy-MM-dd H:i:s"))
    summaries.push("by " + newState?.updatedBy)
    return await updatedLotHistory(lot_id, newState, description, summaries.join(" ") )
}

export async function amortizationDeletedLotHistory(lot_id: string, newState:any, description = "AMORTIZATION CANCELLED" ) {
    let summaries:string[] = []
    const user = await getUserService((await auth())?.user_id)
    summaries.push("Amortization cancelled at")
    summaries.push(serverFormatDate(new Date(), "yyyy-MM-dd H:i:s"))
    summaries.push("by " + user?.first_name +" " + user?.middle_name + " " + user?.last_name)
    return await updatedLotHistory(lot_id, newState, description, summaries.join(" ") )
}

export async function amortizationTransferLotHistory(lot_id: string, newState:any, description = "LOT MIGRATED FROM" ) {
    let summaries:string[] = []
    const user = await getUserService((await auth())?.user_id)
    summaries.push("Lot amortization transferred at")
    summaries.push(serverFormatDate(new Date(), "yyyy-MM-dd H:i:s"))
    summaries.push("by " + user?.first_name +" " + user?.middle_name + " " + user?.last_name)
    summaries.push(newState?.summary_from)
    summaries.push(newState?.summary_to)
    return await updatedLotHistory(lot_id, newState, description, summaries.join(" ") )
}

export async function onHoldLotHistory(lot_id: string, newState:any, description = "LOT PUT ON HOLD" ) {
    return await updatedLotHistory(lot_id, newState, description)
}