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
    ])

}

export async function getBuyerAmortizationSummaryService(amortization_id: string) {
    await dbConnect()
    let amortization:any = await getAmortizationService(amortization_id)
    const summary = await getAmortizationSummaryService(amortization_id)
    if(!amortization) {
        return null
    }
    return {...amortization.toJSON(), summary}
}

export async function getBuyerLotsDueService(user_id: string, active: boolean = true) {
    await dbConnect()
    const amortizations:any = await getBuyerLotsService(user_id, active)
    const buyerLots:any[] = []
    for(let i = 0; i < amortizations.length; i++) {
        const summary = await getAmortizationSummaryService(amortizations[i]._id)
        const delayed = summary.filter((item:any) => item.isDelayed).map((item:any) => item)
        if(delayed.length > 0) {
            buyerLots[i] = {
                ...amortizations[i].toObject(),
                delayed
            }
        }
    }

    return buyerLots
}

export async function getAmortizationService(amortization_id: String, populate :any = [
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
    return await Amortization.findById(amortization_id)
    .populate(populate).populate({
        path: 'payment_ids',
        populate: {path: 'receiver_account_id acceptable_payment_id verified_by created_by updated_by'},
        options: {sort: { display_sort: 1}}
    })
}

export async function getAmortizationSummaryService(amortization_id: String) {
    await dbConnect()
    const amortization:any = await getAmortizationService(amortization_id)
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
            isDelayed : boolean
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
}