import { DEFAULT_COMPANY, LotHistoryAction, TABLE } from "@/serverConstant";
import { Schema, Document, models, model, Model } from "mongoose"

export interface History extends Document {
    company_id: Schema.Types.ObjectId,
    created_by:Schema.Types.ObjectId,
    table: String,
    entity_id:Schema.Types.ObjectId,
    action:String,
    description: String,
    summaries: String,
    before: {},
    after: {}
}

const historySchema = new Schema<History>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    created_by: {type: Schema.Types.ObjectId, ref : "User", default: null },
    table : {type : String, required: true, enum:TABLE},
    entity_id: { type : Schema.Types.ObjectId },
    action : {type : String, required: true, default: LotHistoryAction.CREATED , enum: LotHistoryAction },
    description : {type : String, required: true},
    summaries: {type: String},
    before: {type : {}, },
    after: {type: {}}
},{
    timestamps : true
});

historySchema.index({entity_id: 1})
historySchema.index({table: 1})

const History:Model<History> = models.History || model<History>("History",historySchema,"histories")
export default History