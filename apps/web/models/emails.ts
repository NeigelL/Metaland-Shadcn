import { Schema, models, model, Model } from "mongoose"
import referenceSchema, { preValidateReferenceCode } from "./base/reference_code";
import { changelogPlugin } from "./changelog";
import { EnumEmailAction, IEmail } from "./interfaces/emails";
import { DEFAULT_COMPANY } from "@/serverConstant";


// bounced - The recipient’s mail server rejected the email. (Learn more about bounced emails)
// canceled - The scheduled email was canceled (by user).
// clicked - The recipient clicked on a link in the email.
// complained - The email was successfully delivered to the recipient’s mail server, but the recipient marked it as spam.
// delivered - Resend successfully delivered the email to the recipient’s mail server.
// delivery_delayed - The email couldn’t be delivered to the recipient’s mail server because a temporary issue occurred. Delivery delays can occur, for example, when the recipient’s inbox is full, or when the receiving email server experiences a transient issue.
// failed - The email failed to be sent.
// opened - The recipient opened the email.
// queued - The email created from Broadcasts or Batches is queued for delivery.
// scheduled - The email is scheduled for delivery.
// sent - The email was sent successfully.


const userSchema = new Schema<IEmail>({
    ...referenceSchema.obj,
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    audience_id: { type : Schema.Types.ObjectId, ref: "Audience", default: null },
    email_template_id: {type: Schema.Types.ObjectId, ref : "EmailTemplate", default: null },
    amortization_id: [{type: Schema.Types.ObjectId, ref : "Amortization", default: null }],
    user_id: [{type: Schema.Types.ObjectId, ref : "User", default: null }],
    resend_id: {type: String, default: null}, // 254c761a-370e-495f-a572-18ab2950629a
    email_action: {type: String, default: EnumEmailAction.WELCOME_PACKET}, // welcome_packet
    description: {type : String, default: null},
    cc: [{type : String}],
    bcc: [{type : String}],
    reply_to: [{type : String}],
    to: [{type : String}],
    from: {type : String, default: null},
    subject: {type : String, default: null},
    plain_text: {type : String, default: null},
    html: {type : String, default: null},
    events: [{
        type: Schema.Types.Mixed,
        default: null
    }]
},{
    timestamps: true,
    toJSON: { virtuals: true }
});
userSchema.plugin(changelogPlugin, {"collection_name": "emails"});

preValidateReferenceCode(userSchema,"EMA","emails")

const Email:Model<IEmail>= models?.Email || model<IEmail>("Email",userSchema, 'emails')
export default Email