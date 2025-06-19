import { EnumPaymentType } from '@/types/payment'
import { Document } from 'mongoose'

export interface IPayment extends Document {
    company_id: String,
    amortization_id: String,
    receiver_account_id : String,
    acceptable_payment_id : String,
    created_by:String,
    reference_code: String,
    reference_number?: String, // from bank reference number
    sales_report_id?: String,
    deleted_by?: String,
    sub_payment_id?: IPayment[]
    amount: Number,
    type: EnumPaymentType,
    name: String,
    invoice_number: String,
    remark: String,
    files: [],
    confirmed?: boolean,
    date_payment_verified: Date,
    verified: Boolean,
    verified_by: String | null,
    deleted?: boolean,
    active?: boolean,
    date_paid: Date,
    online_date_paid: Date,
    editable: boolean,
    reservation: boolean,
    description: String,
    commissionable: boolean,
    commissioned: boolean,
    commission_amount: Number,
    commission_percent: Number,
    commission_id: String,
    display_sort: Number,
}