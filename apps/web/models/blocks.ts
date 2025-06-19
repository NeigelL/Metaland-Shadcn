import { DEFAULT_COMPANY } from "@/serverConstant"
import { Schema, Document, models, model, Model } from "mongoose"

export interface IBlock extends Document {
    company_id: Schema.Types.ObjectId,
    project_id : Schema.Types.ObjectId,
    created_by: Schema.Types.ObjectId
    name: string,
    area?: Number,
    description?: string,
    active?: boolean,
    sort: Number
}

const blockSchema = new Schema<IBlock>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    project_id : { type : Schema.Types.ObjectId, required : true ,ref: "Project" },
    created_by: { type : Schema.Types.ObjectId, required : true , ref: "User"},
    name : {
        type: String,
        required: [true, "Please provide a name"],
        maxlength:[200, "Name cannot be more than 200 characters"]
    },
    description: {
        type: String,
    },
    area: {
        type: Number,
    },
    active: {type: Boolean, default: true},
    sort: {type: Number, default: 1}
}, {
    timestamps : true,
    toJSON: { virtuals: true },
})

blockSchema.virtual('blockLots',{
    ref:"Lot",
    localField:"_id",
    foreignField:"block_id"
})

blockSchema.virtual('availableCounter',{
    ref:"Lot",
    localField:"_id",
    foreignField:"block_id",
    count: true,
    match: {status: "available"}
})

blockSchema.virtual('soldCounter',{
    ref:"Lot",
    localField:"_id",
    foreignField:"block_id",
    count: true,
    match: {status: "sold"}
})

blockSchema.virtual('onholdCounter',{
    ref:"Lot",
    localField:"_id",
    foreignField:"block_id",
    count: true,
    match: {status: "onhold"}
})


blockSchema.virtual('inactiveCounter',{
    ref:"Lot",
    localField:"_id",
    foreignField:"block_id",
    count: true,
    match: {active: false }
})

const Block: Model<IBlock> = models.Block || model<IBlock>("Block", blockSchema, "blocks")
export default Block