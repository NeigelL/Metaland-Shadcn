import {model, models, Schema, Document, Model } from "mongoose"
import User from "./users"
import { DEFAULT_COMPANY } from "@/serverConstant"
import { createdLotHistory, updatedLotHistory } from "./historiesModel"


export interface Lot extends Document {
    company_id: Schema.Types.ObjectId,
    project_id : Schema.Types.ObjectId,
    block_id : Schema.Types.ObjectId,
    buyer_id?: Schema.Types.ObjectId,
    agent_id?: Schema.Types.ObjectId,
    created_by: Schema.Types.ObjectId,
    amortization_id?: Schema.Types.ObjectId,
    transfer_by?: Schema.Types.ObjectId,
    legend?: Schema.Types.ObjectId,
    name: string,
    area: Number,
    contract_price?: Number,
    price_per_sqm?: Number,
    lot_condition?: String,
    listed_price?: Number,
    premium?: Boolean,
    discount_percentage?: Number,
    discount_price?: Number,
    status?: String, // available, sold, onhold
    latitude?: String,
    longitude?: String
    date_sold?: Date,
    payment_scheme?: String,
    special_stipulation?: String
    restriction?: String,
    vat?: String,
    transfer_tax?: Number,
    buyer_seller_pay_tax?: Number,
    transfer_date?: Date,
    onhold_expiry?: Date,
    active?:boolean,
    remark?: String,
    hold_customer?:String,
    sort: Number
}

const lotSchema = new Schema<Lot>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    project_id : { type : Schema.Types.ObjectId, ref: "Project", required: true },
    block_id : { type : Schema.Types.ObjectId, ref: "Block",  required: true },
    buyer_id : { type : Schema.Types.ObjectId, ref: "User", default:null },
    agent_id : { type : Schema.Types.ObjectId, ref: "User", default:null },
    created_by : { type : Schema.Types.ObjectId, ref: "User", default:null },
    amortization_id : { type : Schema.Types.ObjectId, ref: "Amortization", default:null },
    transfer_by: { type : Schema.Types.ObjectId, ref: "User", default:null },
    legend: {type: Schema.Types.ObjectId, ref : "ProjectLegend"},
    name : {
        type: String,
        required: [true, "Please provide a name"],
        maxlength:[200, "Name cannot be more than 200 characters"]
    },
    area: {type: Number},
    contract_price :  {type: Number},
    price_per_sqm:   {type: Number},
    lot_condition:   {type: String, default:"As Is Where Is"},
    listed_price:   {type: Number},
    premium:   {type: Boolean, default: false},
    discount_percentage:   {type: Number},
    discount_price:   {type: Number},
    status:   {type: String, default:"available"},
    latitude:   {type: String},
    longitude:   {type: String},
    date_sold:   {type: Date},
    payment_scheme:   {type: String},
    special_stipulation: {type: String},
    restriction: {type: String},
    vat: {type: Number},
    transfer_tax: {type: Number},
    buyer_seller_pay_tax: {type: Number},
    transfer_date: {type: Date},
    onhold_expiry:{type:Date},
    active: {type: Boolean, default: true},
    remark: {type: String,  default: "REGULAR LOT" },
    hold_customer: {type: String,  default: "" },
    sort: {type: Number,  default: 1 }
}, {
    timestamps : true
})

lotSchema.post('save', async function(document:any) {
    if(document.isNew) {
        await createdLotHistory(document._id,document)
    } else {
        await updatedLotHistory(document._id, document)
    }
});

lotSchema.post('updateOne', async function(document:any) {

    if(document.status == "onhold") {
        let agent = await User.findById(document.agent_id)
        await updatedLotHistory(
            document._id,
            document,
            "LOT WAS PUT ON HOLD FOR CUSTOMER " + document.hold_customer ,
            [
                "LOT WAS PUT ON HOLD FOR CUSTOMER " + document.hold_customer,
                "By AGENT: " + agent?.first_name + " " + agent?.middle_name + " " + agent?.last_name,
            ]
         )
    }

    if(document.status == "available") {
        await updatedLotHistory(document._id, document, "LOT IS NOW AVAILABLE")
    }

    if(document.status == "sold") {
        await updatedLotHistory(document._id, document, "LOT IS NOW SOLD")
    }
});

lotSchema.index({amortization_id: 1})

const Lot: Model<Lot> = models?.Lot || model<Lot>("Lot", lotSchema,"lots" )
export default Lot