import { Schema } from "mongoose";

const verifiedSchema = new Schema({
    verified: { type: Boolean, default: false },
    verified_by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    verified_at: { type: Date, default: null }
})

export default verifiedSchema