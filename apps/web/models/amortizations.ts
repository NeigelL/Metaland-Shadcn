import { Schema,models,model, Model } from "mongoose"
import referenceSchema, { preValidateReferenceCode } from "./base/reference_code";
import createdSchema, { preValidateCreatedBy } from "./base/created_by";
import updatedSchema, { preUpdateOneUpdatedBy } from "./base/updated_by";
import deletedSchema, { preUpdateOneDeletedBy } from "./base/deleted_by";
import { ITagHistoryAction, ITagHistoryEntry } from "./interfaces/tag_histories";
import { IDescription } from "./interfaces/descriptions";
import Lot from "./lots";
import { amortizationTransferLotHistory } from "./historiesModel";
import { auth } from "@/lib/nextAuthOptions";
import { IAmortization } from "./interfaces/amortizations";
import { COMMISSION_ADMIN_IDS, DEFAULT_COMPANY } from "@/serverConstant";

const tagHistorySchema = new Schema<ITagHistoryEntry>({
    action: {type: String, default: ITagHistoryAction.ADDED},
    tag: {type: Schema.Types.ObjectId, ref: "Tag"},
    timestamp: {type: Date, default: Date.now},
    created_by: {type: Schema.Types.ObjectId, ref: "User", default: null}
})

const descriptionSchema = new Schema<IDescription>({
    description: {type: String, default: ""},
    timestamp: {type: Date, default: Date.now},
    created_by: {type: Schema.Types.ObjectId, ref: "User", default: null}
})

const amortSchema = new Schema<IAmortization>({
    ...referenceSchema.obj,
    ...createdSchema.obj,
    ...updatedSchema.obj,
    ...deletedSchema.obj,
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY},
    project_id : { type : Schema.Types.ObjectId, ref: "Project"},
    block_id: { type : Schema.Types.ObjectId, ref: "Block"},
    lot_id : { type : Schema.Types.ObjectId, ref: "Lot"},
    realty_id: { type : Schema.Types.ObjectId, ref: "Realty", default:null},
    team_lead: { type : Schema.Types.ObjectId,  ref: "User", default: null},
    team_lead_2: { type : Schema.Types.ObjectId,  ref: "User", default: null},
    agent_id: { type : Schema.Types.ObjectId,  ref: "User", default: null},
    agent_id_2: { type : Schema.Types.ObjectId,  ref: "User", default: null},
    broker_id: { type : Schema.Types.ObjectId,  ref: "User", default: null},
    buyer_ids: [ {type: Schema.Types.ObjectId, default: [], ref: 'User'} ],
    payment_ids: [{type: Schema.Types.ObjectId, ref: "Payment", default:null}],
    deleted_payment_ids: [{type: Schema.Types.ObjectId, ref: "Payment", default:null}],
    monthly_schedules: [{
        due_date: {type: Date, default: null},
        amount:{type: Number, default: 0},
        completed_percent: {type: Number, default: 0},
        running_balance: {type: Number, default: 0},
    }],
    monthly_equities: [ {
        due_date: {type: Date, default: null},
        amount:{type: Number, default: 0},
        completed_percent: {type: Number, default: 0},
        running_balance: {type: Number, default: 0},
    }],
    area: {type: Number, default: 0},
    price_per_sqm: {type: Number, default: 0},
    tcp: {type: Number, default: 0},
    down_payment: {type: Number, default: 0},
    down_payment_percent_amount: {type: Number, default: 0},
    discount_percent: {type: Number, default: 0},
    discount_percent_amount : {type: Number, default: 0},
    reservation : {type: Number, default: 0},
    reservation_date : {type: Date, default: null },
    reservation_paid : {type: Boolean, default: false},
    lot_condition: {type: String, default: ""},
    balance: {type: Number, default: 0},
    monthly: {type: Number, default: 0},
    equityMonthly: {type: Number, default: 0},
    commission_sharing: [{
        entity_id: {type: Schema.Types.ObjectId, ref: "User", default: null},
        type: {type: String, default: null, enum: [
            "team_lead", "team_lead_2", "realty_id", "agent_id", "agent_id_2", "broker_id"
        ]},
        percent: {type: Number, default: 0},
    }],
    overall_commission_percent:  {type: Number, default: 0} ,
    overall_commission_amount:  {type: Number, default: 0},
    terms: {type: Number, default: 0},
    years: {type: Number, default: 0},
    remarks: {type: String, default: ""},
    active: {type: Boolean, default: true},
    total_paid: {type: Number, default: 0},
    total_paid_percent: {type: Number, default: 0},
    commission_sharing_locked: {type: Boolean, default: false},
    commission_sharing_locked_by: {type: Schema.Types.ObjectId, ref: "User", default: null},
    commission_total_released: {type: Number, default: 0},
    monthlyCalculate: {type: Boolean, default: true},
    equityCalculate: {type: Boolean, default: true},
    full_commission: {type: Boolean, default: false},
    full_commission_id: {type: Schema.Types.ObjectId, ref: "Payment", default: null},
    full_commission_by: {type: Schema.Types.ObjectId, ref: "User", default: null},
    tags: [{type: Schema.Types.ObjectId, ref: "Tag", default: []}],
    tagHistory: [tagHistorySchema],
    description: {type: String, default: ""},
    descriptionHistory: [descriptionSchema],
},{
    timestamps : true,
    toJSON: { virtuals: true },
});

preValidateReferenceCode(amortSchema,"MA","amortizations")
preValidateCreatedBy(amortSchema)
preUpdateOneUpdatedBy(amortSchema)
preUpdateOneDeletedBy(amortSchema)

amortSchema.pre('save', async function(next) { // pre save calculate percent and amount
    try {
        let result = calculatePercentAndAmount(this)
        this.overall_commission_percent = result.overall_commission_percent
        this.overall_commission_amount = result.overall_commission_amount
    } catch(error:any) {
        console.log("Amortization save Schema error: " + error.toString())
    }
    next()
})

function calculatePercentAndAmount(amortization:any) {
    let percent: number = amortization?.commission_sharing?.reduce((accumulator:any, currentValue:any) => {
        if(currentValue?.percent > 0) {
            return accumulator + currentValue.percent
        } else {
            return accumulator + 0
        }
    },0)

    let amount: number = 0
    if(percent > 0) {
        amount = (Number(amortization?.tcp) - Number(amortization?.reservation) - Number(amortization?.discount_percent_amount) ) * Number(Number(percent)/100)
    }

    return {overall_commission_percent: percent, overall_commission_amount: amount}
}

amortSchema.pre('updateOne', async function(next) { // updateOne calculate percent and amount
        try {
            const update:any = await this.getUpdate()
            if(update) {
                update.$set = update?.$set || {}
                
                let result = calculatePercentAndAmount(update?.$set)
                update.$set.overall_commission_percent = result.overall_commission_percent
                update.$set.overall_commission_amount = result.overall_commission_amount

                let oldData = await this.model.findOne(this.getQuery())
                let user = await auth()
                if(oldData?.commission_sharing_locked && !COMMISSION_ADMIN_IDS.includes(user?.user_id) ) { // avoid updating this fields once the commission is locked
                    ["commission_sharing_locked", "commission_sharing", "realty_id","team_lead", "team_lead_2", "agent_id", "agent_id_2"].forEach((field) => {
                        delete update.$set[field]
                    })
                }

                if(update.$set?.commission_sharing_locked && update.$set?.commission_sharing_locked === true && !oldData?.commission_sharing_locked && update.$set.commission_sharing_locked_by !== user?.user_id) {
                    if(!update.$set.commission_sharing_locked_by) {
                        update.$set.commission_sharing_locked_by = user?.user_id
                    }
                }
            }
        } catch(error:any) {
            console.log("Amortization updateOne Schema error: " + error.toString())
        }
        next()
});

amortSchema.post("updateOne", async function(result:any) {
    if(result.modifiedCount > 0 ) {
        const updatedDoc = await this.model.findOne(this.getQuery()).populate("payment_ids")
        await updatedDoc.assessAmortization()
        await updatedDoc.save()
    }
})

amortSchema.pre("updateOne", async function(next) { // process transfer
    try {
        const update:any = await this.getUpdate()
        if(update) {
            update.$set = update?.$set || {}
            const transfer = update.$set?.transfer || false
            const old_lot_id = update.$set?.old_lot_id || null
            const state = update.$set || null
            if(transfer && old_lot_id) {
                await Lot.updateOne({_id: old_lot_id},{$set: {status: "available", amortization_id: null }})
                const finalOldLot:any = await Lot.findById(state.lot_id).populate("project_id").populate("block_id")
                const finalLot:any = await Lot.findById(state.lot_id).populate("project_id").populate("block_id")
                amortizationTransferLotHistory(old_lot_id,{
                    from: state.old_project_id + " / " + state.old_block_id + " / " + state.old_lot_id,
                    to: state.project_id + " / " + state.block_id + " / " + state.lot_id,
                    from_object: finalOldLot,
                    to_object: finalLot,
                    summary_from : "Lot transferred from " + finalOldLot?.project_id?.name + " " + finalOldLot?.block_id?.name + " " + finalOldLot?.lot_id?.name,
                    summary_to : "Lot transferred to " + finalLot?.project_id?.name + " " + finalLot?.block_id?.name + " " + finalLot?.lot_id?.name,
                })
            }
        }
    } catch(error:any) {
        console.log("Amortization updateOne process transfer" + error.toString())
    }
    next()
})

amortSchema.methods.assessAmortization = async function() { // payment_ids needs to be populated
    try {
        let total_paid = 0
        if(this?.payment_ids) {
            total_paid = this.payment_ids.reduce((p:any, currentValue:any) => {
                return Number(p + currentValue.amount)
            },0)
        }
        this.total_paid = total_paid
        if(total_paid && total_paid > 0) {
            this.total_paid_percent = (total_paid / this.tcp) * 100
        }

        //fix commission_sharing structure
        this.commission_sharing = this.commission_sharing.map((cs:any) => {
            if(!cs.entity_id) {
                cs.entity_id = null
            }

            if(!cs.percent) {
                cs.percent = 0
            }

            return cs
        })

        let result = calculatePercentAndAmount(this)
        if(result?.overall_commission_percent && result.overall_commission_percent > 0) {
            this.overall_commission_percent = result.overall_commission_percent
            this.overall_commission_amount = result.overall_commission_amount
        }

        let sum_percent = this.reservation > 0 ? ( this.reservation / this.tcp) * 100 : 0
        let balance = this.tcp - this.discount_percent_amount - this.reservation
            for(let i = 0; i < this.monthly_equities.length; i++) {
                let schedule = this.monthly_equities[i]

                if(schedule.amount && schedule.amount > 0) {
                    let completed_percent = (schedule.amount / this.tcp) * 100
                    sum_percent += completed_percent
                    this.monthly_equities[i].completed_percent = sum_percent
                    this.monthly_equities[i].running_balance = balance - schedule.amount
                    balance = this.monthly_equities[i].running_balance
                }
            }

            for(let i = 0; i < this.monthly_schedules.length; i++) {
                let schedule = this.monthly_schedules[i]

                if(schedule.amount && schedule.amount > 0) {
                    let completed_percent = (schedule.amount / this.tcp) * 100
                    sum_percent += completed_percent
                    this.monthly_schedules[i].completed_percent = sum_percent
                    this.monthly_schedules[i].running_balance = balance - schedule.amount
                    balance = this.monthly_schedules[i].running_balance
                }
            }

    } catch(error:any) {
        console.log("Amortization assessAmortization Schema error: " + error.toString())
    }
}
amortSchema.virtual('tcp_clean').get(function() {
    return Number(this.tcp) - Number(this.discount_percent_amount) - Number(this.reservation)
})

amortSchema.virtual('cancellable').get(function() {
    
    if(this?.payment_ids?.length > 0) {
        return false
    }

    return !this.full_commission
})

amortSchema.virtual('summary').get(function() {
    
    // if(this?.payment_ids?.length == 0) {
    //     return []
    // }
    const amortization:any = this ?? {}
    const amortization_id = amortization?._id?.toString() ?? ""
    const { monthly_equities: equities = [], monthly_schedules : schedules = [], payment_ids: payments = [] } = amortization ?? {}
    
    const determinePaymentStatus = (item:any) => {
        let textClasses:any = []
        let due_date = new Date(item?.due_date)
        let today = new Date()
        let isPaid = false
        let isWarning = false
        let isDelayed = false
        if( ((item?.completed_percent - amortization?.total_paid_percent ) <= 0.01 || amortization?.total_paid_percent > item?.completed_percent) && amortization?.total_paid_percent > 0 )  {
            isPaid = true
            textClasses.push("text-success")
        }

        if( !isPaid && amortization?.total_paid_percent <= item?.completed_percent &&
            due_date.getMonth() == today.getMonth() && due_date.getFullYear() <= today.getFullYear()
        ) {
            isWarning = true
            textClasses.push("text-warning")
        }

        if( !isWarning && !isPaid && due_date < today && amortization?.total_paid_percent <= item?.completed_percent  ) {
            isDelayed = true
            textClasses.push("text-danger")
        }
        item.isPaid = isPaid
        item.isWarning = isWarning
        item.isDelayed = isDelayed
        return textClasses
    }
        type SheetRow = {
            ma_label: string,
            due_date: Date,
            amount: number,
            payment_date_paid: Date,
            payment_amount: number,
            payment_invoice_number: string,
            payment_running_balance: number,
            payment_reference_code?: string,
            completed_percent?: number,
            payment?: any,
            div_class?: string[]
            isPaid : boolean ,
            isWarning : boolean,
            isDelayed : boolean,
        }

        let runningBalance = amortization.tcp
        let paymentStack:any[] = payments
        let tempSheet : SheetRow[] = []
        let reservationPayment = payments[0]? {
            date_paid: payments[0].date_paid,
            amount: payments[0].amount,
            invoice_number: payments[0].invoice_number,
            reference_code: payments[0].reference_code,
            running_balance: 0,
            ...payments[0]
        } : {
            date_paid: "",
            amount: 0,
            invoice_number: "",
            running_balance: 0,
            payment_reference_code: "",
        }

        runningBalance = runningBalance - amortization.discount_percent_amount
        if(amortization.reservation > 0) {
            runningBalance = runningBalance - amortization.reservation
            let currentItem : SheetRow = {
                ma_label: "RSV",
                due_date: amortization.reservation_date,
                amount: amortization.reservation,
                completed_percent: 0,
                payment_date_paid: reservationPayment.date_paid,
                payment_amount: reservationPayment.amount,
                payment_invoice_number: reservationPayment.invoice_number,
                payment_running_balance: runningBalance,
                payment_reference_code: reservationPayment.reference_code,
                payment: {...reservationPayment, amortization_id: amortization_id},
                isPaid: false,
                isWarning: false,
                isDelayed: false,
            }
            determinePaymentStatus(currentItem)
            tempSheet.push(currentItem)
            paymentStack?.shift()
        }

        if(amortization?.down_payment > 0) {
            equities.map( (equity:any, key:any) => {
                let payment = paymentStack?.shift()?? {
                    date_paid: "",
                    amount: 0,
                    invoice_number: "",
                    running_balance: 0,
                    reference_code: ""
                }

                runningBalance = runningBalance - payment.amount
                let eqItem : SheetRow = {
                    ma_label: "EQ"+ (key + 1),
                    due_date: equity?.due_date,
                    amount: equity?.amount,
                    completed_percent: equity?.completed_percent,
                    payment_date_paid: payment.date_paid,
                    payment_amount: payment.amount,
                    payment_invoice_number: payment.invoice_number,
                    payment_running_balance: runningBalance,
                    payment_reference_code: payment.reference_code,
                    payment: {...payment, amortization_id: amortization_id},
                    isPaid: false,
                    isWarning: false,
                    isDelayed: false,
                }
                determinePaymentStatus(eqItem)
                tempSheet.push(eqItem)
            })
        }

        schedules.map( (schedule:any, key:any) => {
            let payment = paymentStack?.shift()?? {
                date_paid: "",
                amount: 0,
                invoice_number: "",
                running_balance: 0
            }
            runningBalance = runningBalance - payment.amount
            let maItem : SheetRow = {
                ma_label: "MA"+ (key+1),
                due_date: schedule?.due_date,
                amount: schedule?.amount,
                completed_percent: schedule?.completed_percent,
                payment_date_paid: payment.date_paid,
                payment_amount: payment.amount,
                payment_invoice_number: payment.invoice_number,
                payment_running_balance: runningBalance,
                payment_reference_code: payment.reference_code,
                payment: {...payment, amortization_id: amortization_id},
                isPaid: false,
                isWarning: false,
                isDelayed: false,
            }
            determinePaymentStatus(maItem)
            tempSheet.push(maItem)
        })
        return tempSheet
})

amortSchema.index({monthly_equities: 1})
amortSchema.index({monthly_schedules: 1})
amortSchema.index({project_id: 1})
amortSchema.index({block_id: 1})
amortSchema.index({lot_id: 1})
amortSchema.index({realty_id: 1})
amortSchema.index({team_lead: 1})
amortSchema.index({team_lead_2: 1})
amortSchema.index({agent_id: 1})
amortSchema.index({agent_id_2: 1})
amortSchema.index({broker_id: 1})
amortSchema.index({buyer_ids: 1})
amortSchema.index({payment_ids: 1})
amortSchema.index({active: 1})
// amortSchema.index({reference_code: 1})


const Amortization:Model<IAmortization> =  models.Amortization || model<IAmortization>("Amortization",amortSchema,"amortizations")
export default Amortization