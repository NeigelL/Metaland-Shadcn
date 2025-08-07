import { DEFAULT_BRANCH, DEFAULT_COMPANY } from "@/serverConstant"
import { IProject } from "@/types/project"
import { Schema, models, model, Model } from "mongoose"


const projectSchema = new Schema<IProject>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    created_by : { type : Schema.Types.ObjectId, ref: "User"},
    branch_id: {type: Schema.Types.ObjectId, ref: "Branch", default: DEFAULT_BRANCH },
    name : {
        type: String,
        required: [true, "Please provide a name"],
        maxlength:[200, "Name cannot be more than 200 characters"]
    },
    address1 : {
        type: String,
        maxlength:[255, "Address cannot be more than 255 characters"]
    },
    address2 : {
        type: String,
        maxlength:[255, "Address2 cannot be more than 255 characters"]
    },
    region : {
        type: String,
        maxlength:[255, "Region cannot be more than 255 characters"]
    },
    province : {
        type: String,
        maxlength:[255, "Province cannot be more than 255 characters"]
    },
    city: {
        type: String,
        maxlength:[255, "City cannot be more than 255 characters"]
    },
    barangay:  {
        type: String,
        maxlength:[255, "Barangay cannot be more than 255 characters"]
    },
    zip: {
        type: String,
        maxlength:[255, "Zip cannot be more than 255 characters"]
    },
    landmark: {
        type: String,
        maxlength:[255, "Landmark cannot be more than 255 characters"]
    },
    latitude: {
        type: String,
        maxlength:[255, "Latitude cannot be more than 255 characters"]
    },
    longitude: {
        type: String,
        maxlength:[255, "Longitude cannot be more than 255 characters"]
    },
    original_owners : [{}],
    purchase_scheme: {
        type: String,
        maxlength:[255, "Purchase Scheme cannot be more than 255 characters"]
    },
    title_information: {
        type: String,
        maxlength:[255, "Purchase Scheme cannot be more than 255 characters"]
    },
    legal_documentation: {
        type: String,
        maxlength:[255, "Purchase Scheme cannot be more than 255 characters"]
    },
    restrictions: {
        type: String,
    },
    terrane_information: {
        type: String,
        maxlength:[255, "Terrane information Scheme cannot be more than 255 characters"]
    },
    total_number_of_lots: {
        type: Number,
    },
    date_bought: {
        type: Date,
    },
    date_begin_selling: {
        type: Date,
    },
    date_begin_grading: {
        type: Date,
    },
    investment_amount: {
        type: Number,
    },
    geographic_layer_file: {
        type: String,
    },
    bulk_discount_scheme: {
        type: Number,
    },
    LTS: {
        type: String,
    },
    project_type: {type: String, default: ""},
    project_status: {type: String, default: ""},
    legends:[
        {type: String,}
    ],
    active: {
        type : Boolean, default: true
    },
    total_area: {type: Number, required: true},
    titled: {type: Boolean, default: false},
    description: { type: String, default: "" },
    portal: {
        agent: {type: Boolean, default: false},
        buyer: {type: Boolean, default: false},
        admin: {type: Boolean, default: false}
    }
}, {
    timestamps : true
})

projectSchema.index({branch_id: 1})
projectSchema.index({active: 1})

const Project: Model<IProject> = models.Project || model<IProject>("Project", projectSchema,"projects")
export default Project