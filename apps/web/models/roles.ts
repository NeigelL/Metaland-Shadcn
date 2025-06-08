import { DEFAULT_COMPANY } from "@/lib/serverConst"
import { IRole } from "@/types/roles"
import {Model, model, models, Schema } from "mongoose"



const roleSchema = new Schema<IRole>({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        maxlength:[200, "Role Name cannot be more than 200 characters"]
    },
    description: {type: String, default: ""},
    permissions: {type: Map, of: Boolean, default: {} },
    company_id: {type: Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY},
    deleted: {type: Boolean, default: true}
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

const Role :Model<IRole> = models.Role  ||  model<IRole>("Role", roleSchema, "roles")
export default Role