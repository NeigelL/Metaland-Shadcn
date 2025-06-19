import { auth } from "@/lib/nextAuthOptions";
import { Schema } from "mongoose";

const deletedSchema = new Schema({
    deleted: { type: Boolean, default: false },
    deleted_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    deleted_at: { type: Date, default: null }
})

export function preUpdateOneDeletedBy(schema: Schema) {
    schema.pre('updateOne', async function(next) {
        try {
            const update:any = await this.getUpdate()
            if(update) {
                let user  = await auth()
                update.$set = update?.$set || {}
                update.$set.updated_by = user?.user_id
                if(update.$set.deleted) {
                    update.$set.deleted_by = user?.user_id
                    update.$set.deleted_at = new Date()
                }
            }
        } catch(error:any) {
            console.log("Updated By preUpdateOneDeletedBy Schema error: " + error.toString())
        }
        next()
    });
}

export default deletedSchema