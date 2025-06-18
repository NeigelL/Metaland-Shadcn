import { DEFAULT_COMPANY } from "@/serverConstant";
import  {Schema, Document, models, model, Model} from "mongoose";


export interface ICounter extends Document {
    company_id: String,
    collection_name: String,
    prefix: String,
    sequenceValue: Number
}

const counterSchema = new Schema<ICounter>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    collection_name: {
        type : String,
        required : [true,"Please provide a collection name"]
    },
    prefix: {
        type: String,
        required : true,
        default: "MA"
    },
    sequenceValue: {
        type: Number,
        required : true,
        default: 0
    }
}, {
    timestamps : true,
    toJSON:{virtuals: true}
})

counterSchema.index({collection_name: 1})
counterSchema.index({prefix: 1})

const Counter: Model<ICounter> = models?.Counter || model<ICounter>("Counter", counterSchema,"counters")
export default Counter