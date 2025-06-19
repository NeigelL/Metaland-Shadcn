import { DEFAULT_COMPANY } from "@/serverConstant";
import { Schema, Document, models, model, Model } from "mongoose"


export interface IReceiverAccount extends Document {
    company_id: Schema.Types.ObjectId,
    created_by: Schema.Types.ObjectId,
    mode_of_payment: String,
    name: String,
    account_number: String,
    description?: String,
    active?: boolean
}

const receiverAccountSchema = new Schema<IReceiverAccount>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    created_by: { type : Schema.Types.ObjectId, required : true , ref: "User"},
    mode_of_payment : {type: String, required : true},
    name : {type: String, required : true},
    account_number : {type: String, required : true},
    description : {type: String},
    active: {type: Boolean, default: true}
},{
    timestamps : true
});

const ReceiverAccount:Model<IReceiverAccount> = models?.ReceiverAccount || model<IReceiverAccount>("ReceiverAccount",receiverAccountSchema, 'receiver_accounts')
export default ReceiverAccount