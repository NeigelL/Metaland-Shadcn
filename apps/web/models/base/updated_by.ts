import { auth } from "@/lib/nextAuthOptions";
import { Schema } from "mongoose";

const updatedSchema = new Schema({
    updated_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
})

export function preUpdateOneUpdatedBy(schema: Schema) {
    schema.pre('updateOne', async function(next) {
        try {
            const update:any = await this.getUpdate()
    
            if(update) {
                let user  = await auth()
                update.$set = update?.$set || {}
                update.$set.updated_by = user?.user_id
            }
        } catch(error:any) {
            console.log("Updated By preUpdateOneUpdatedBy Schema error: " + error.toString())
        }
        next()
    });
}

export default updatedSchema