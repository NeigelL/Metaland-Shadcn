import { Schema, models, model, Model } from "mongoose"
import { IBuyerProspect, IUser } from "./interfaces/users";
import referenceSchema, { preValidateReferenceCode } from "./base/reference_code";
import { changelogPlugin } from "./changelog";


export enum ProspectStatus {
    NEW = "NEW",
    CONTACTED = "CONTACTED",
    FOLLOW_UP = "FOLLOW_UP",
    INTERESTED = "INTERESTED",
    NOT_INTERESTED = "NOT_INTERESTED",
}

export enum ProspectSourced {
    PORTAL = "PORTAL",
    ADMIN = "ADMIN",
}

const buyerProspectSchema = new Schema<IBuyerProspect>({
    ...referenceSchema.obj,
    created_by: {type: Schema.Types.ObjectId, ref: "User", default: null},
    first_name: {type : String, required: true},
    middle_name : {type : String},
    last_name : {type : String, required: true},
    address: {type : String},
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Email is invalid"]
    },
    phone_prefix: {
        type: String,
        default: "+63",
    },
    phone: {
        type: String,
        unique: true,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Phone number must be exactly 10 digits"]
    },
    type: {type: String, required: true, enum: ['local', 'international'], default: 'local'},
    communicationPreference: {type: String, default: ''},
    communicationAccount: {type: String, default: ''},
    otherCommunication: {type: String, default: ''},

    land_line: {
        type: String,
        default: null,
    },
    remarks: {type : String, default: null},
    status: {type: String, default: ProspectStatus.NEW, enum: Object.values(ProspectStatus)},
    sourced: {type: String, enum: Object.values(ProspectSourced), default: ProspectSourced.PORTAL},
},{
    timestamps : true,
    toJSON: {
        virtuals: true
    }
});
buyerProspectSchema.plugin(changelogPlugin)

preValidateReferenceCode(buyerProspectSchema,"PRO","buyer_prospects")


buyerProspectSchema.virtual('fullName').get(function(){ return this.first_name + ' ' + this.middle_name+ ' ' + this.last_name })
buyerProspectSchema.index({'email' : 'text','first_name': 'text','middle_name' : 'text', 'last_name' : 'text'})

const BuyerProspect:Model<IBuyerProspect> = models?.BuyerProspect || model<IBuyerProspect>("BuyerProspect",buyerProspectSchema, 'buyer_prospects')
export default BuyerProspect