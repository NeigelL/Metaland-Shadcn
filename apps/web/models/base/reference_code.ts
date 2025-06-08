import { Schema } from "mongoose";
import Counter from "../counters";

const referenceSchema = new Schema({
    reference_code: { type: String,
        required: true ,
        immutable: true,
         unique: true,
         index: true
        },
})

export function preValidateReferenceCode(schema: Schema, prefix: string, collection: string = "") {
    schema.pre('validate', async function(next) {
        try {
            if(!this.isNew) return next()

            const counter = await Counter.findOneAndUpdate(
                { collection_name: collection.length > 0 ? collection : this.collection.name },
                {$inc: {sequenceValue: 1}, prefix: prefix},
                {new: true, upsert: true}
            )
            this.reference_code = counter.prefix + counter.sequenceValue.toString()
            next()
        } catch (error) {
            console.log(error)
        }
    })
}

export default referenceSchema