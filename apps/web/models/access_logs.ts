import { DEFAULT_COMPANY } from "@/serverConstant";
import { Schema, Document, models,model, Model } from "mongoose"


export interface IAccessLog extends Document {
    company_id: Schema.Types.ObjectId,
    user_id: Schema.Types.ObjectId,
    metadata?: Record<string, any>,
    url: String,
    pathname: String,
    ip?: String,
    timestamp: Date
}

const accessLogSchema = new Schema<IAccessLog>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    user_id : { type : Schema.Types.ObjectId, ref: "User", default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
    url : {type: String, required : true},
    pathname : {type: String},
    ip: {type: String, default: null},
    timestamp: {type: Date, default: Date.now}
},{
    timestamps : true
});

accessLogSchema.index({ user_id: 1})
accessLogSchema.index({ ip: 1})
accessLogSchema.index({ timestamp: 1})

const AccessLog : Model<IAccessLog> = models.AccessLog || model<IAccessLog>("AccessLog",accessLogSchema, 'portal_access_logs')
export default AccessLog