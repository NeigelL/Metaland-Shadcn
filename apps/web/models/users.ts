import { Schema, models, model, Model } from "mongoose"

import { DEFAULT_COMPANY } from "@/serverConstant";
import { IUser } from "./interfaces/users";
import referenceSchema, { preValidateReferenceCode } from "./base/reference_code";
import { changelogPlugin } from "./changelog";

const userSchema = new Schema<IUser>({
    ...referenceSchema.obj,
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    spouse_user_id: {type: Schema.Types.ObjectId, ref : "User" },
    realty_id: {type: Schema.Types.ObjectId, ref : "Realty" },
    department_id: {type: Schema.Types.ObjectId, ref : "Department" },
    first_name: {type : String, required: true},
    middle_name : {type : String},
    last_name : {type : String, required: true},
    address: {type : String},
    region: {type : String},
    province: {type : String},
    city: {type : String},
    barangay: {type : String},
    zip: {type : String},
    gender: {type : String},
    birthdate: {type : Date, default: null},
    civil_status: {type : String},
    password: {type: String, select : false},
    email: { type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Email is invalid"]
    },
    phone: {type : String},
    tin: {type : String},
    position: {type : String},
    tin_issuance: {type : String},
    account_type:{type : String, default: 'buyer'},
    verified: {type : Boolean, default: false},
    active: {type : Boolean, default: true},
    login:{type: Boolean, default: false},
    emailGenerated: {type: Boolean, default:false},
    references: [{type : {}}],
    roles: [],
    override_permissions: {type: Map, of: Boolean, default: {} },
    remarks: {type : String, default: null},
    bank_accounts:[
        {
            type: {
                bank_id: String,
                code: String,
                email: String,
                phone:String,
                account_name: String,
                account_number: String,
                association: String,
                purpose: String,
                remark: String,
                default: Boolean
            },
            default: []
    }]
},{
    timestamps : true,
    toJSON: {
        virtuals: true
    }
});
userSchema.plugin(changelogPlugin, {
    "collection_name": "users"
})

preValidateReferenceCode(userSchema,"USR","users")


userSchema.virtual('fullName').get(function(){ return this.first_name + ' ' + this.middle_name+ ' ' + this.last_name })
userSchema.index({'email' : 'text','first_name': 'text','middle_name' : 'text', 'last_name' : 'text'})

const User:Model<IUser> = models?.User || model<IUser>("User",userSchema, 'users')
export default User