import { Schema, models,model, Model } from "mongoose"
import referenceSchema, { preValidateReferenceCode } from "./base/reference_code";
import createdSchema, { preValidateCreatedBy } from "./base/created_by";
import updatedSchema, { preUpdateOneUpdatedBy } from "./base/updated_by";
import { preUpdateOneDeletedBy } from "./base/deleted_by";
import { DEFAULT_COMPANY } from "@/serverConstant";
import { EnumPaymentType } from "@/types/payment";
import { IPayment } from "./interfaces/payment";

const paymentSchema = new Schema<IPayment>({
    ...referenceSchema.obj,
    ...createdSchema.obj,
    ...updatedSchema.obj,
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    amortization_id: {type: Schema.Types.ObjectId, ref : "Amortization" },
    receiver_account_id: {type: Schema.Types.ObjectId, ref : "ReceiverAccount" },
    acceptable_payment_id: {type: Schema.Types.ObjectId, ref : "AcceptablePayment" },
    sales_report_id : {type: Schema.Types.ObjectId, ref : "SaleReport" },
    deleted_by : { type : Schema.Types.ObjectId, ref: "User", default: null },
    reference_number: {type: String},
    sub_payment_id: [{type: Schema.Types.ObjectId, ref : "Payment", default: [] }],
    amount: {type : Number, required: true},
    type : {type : String, required: true, enum: EnumPaymentType  , default: EnumPaymentType.AMORTIZATION },
    name:{type: String, required:true},
    invoice_number: {type: String},
    remark: {type: String},
    files: [{type: Schema.Types.ObjectId}],
    confirmed : {type : Boolean, default: false},
    date_payment_verified: {type: Date, default: null},
    verified: {type: Boolean, default: false},
    verified_by: { type : Schema.Types.ObjectId, ref: "User", default: null },
    deleted: {type : Boolean, default: false},
    active: {type : Boolean, default: true},
    editable: {type : Boolean, default: true},
    date_paid:{type: Date, default : Date.now, required: true},
    online_date_paid:{type: Date, default : null},
    reservation: {type: Boolean, default: false},
    description: {type: String, default: ""},
    commissionable: {type: Boolean, default: false},
    commissioned: {type: Boolean, default: false},
    commission_amount: {type: Number, default: 0},
    commission_percent: {type: Number, default: 0},
    commission_id: {type: Schema.Types.ObjectId, ref: "Commission", default: null},
    display_sort: {type: Number, default: 1},
},{
    timestamps : true,
    toJSON: {virtuals: true}
})

preValidateReferenceCode(paymentSchema,"PAY","payments")
preValidateCreatedBy(paymentSchema)
preUpdateOneUpdatedBy(paymentSchema)
preUpdateOneDeletedBy(paymentSchema)

paymentSchema.virtual("receiver_account_name",{
    ref: "ReceiverAccount",
    localField: "receiver_account_id",
    foreignField: "_id",
    justOne: true
})

paymentSchema.virtual("acceptable_payment_name",{
    ref: "AcceptablePayment",
    localField: "acceptable_payment_id",
    foreignField: "_id",
    justOne: true
})

paymentSchema.index({amortization_id: 1})
// paymentSchema.index({reference_code: 1})
paymentSchema.index({active: 1})
paymentSchema.index({date_paid: 1})
paymentSchema.index({deleted: 1})
paymentSchema.index({reservation: 1})

const Payment : Model<IPayment> =  models?.Payment || model<IPayment>("Payment",paymentSchema,"payments")
export default Payment