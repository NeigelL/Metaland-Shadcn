import { auth } from "@/lib/nextAuthOptions";
import { Schema } from "mongoose";

const createdSchema = new Schema({
    created_by: { type : Schema.Types.ObjectId, required : true , ref: "User", default:null},
})

createdSchema.pre('validate', async function(next) {
    if(!this.isNew) return next()
        
    if(!this.created_by){
        let user  = await auth()
        this.created_by = user?.user_id
    }
    next()
})

export function preValidateCreatedBy(schema: Schema) {
    schema.pre('validate', async function(next) {
        if(!this.created_by){
            let user  = await auth()
            this.created_by = user?.user_id
        }
        next()
    })
}

export default createdSchema