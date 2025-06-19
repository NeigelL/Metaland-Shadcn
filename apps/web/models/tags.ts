import {model, models, Schema, Document, Model } from "mongoose"
import { ITag } from "./interfaces/tags"
import { DEFAULT_COMPANY } from "@/serverConstant"


const tagSchema = new Schema<ITag>({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength:[200, "Role Name cannot be more than 200 characters"]
    },
    description: {type: String, default: ""},
    color: {type: String, default: ""},
    created_by: {type: Schema.Types.ObjectId, ref: "User", default: null},
    company_id: {type: Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY},
    active: {type: Boolean, default: true},
    deleted: {type: Boolean, default: false},
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

const Tag:Model<ITag> = models?.Tag || model<ITag>("Tag", tagSchema, "tags")
export default Tag