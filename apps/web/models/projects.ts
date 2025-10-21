import { DEFAULT_BRANCH, DEFAULT_COMPANY } from "@/serverConstant"
import { Schema, Document, models, model, Model } from "mongoose"


export interface Project extends Document {
    company_id: Schema.Types.ObjectId,
    created_by: Schema.Types.ObjectId,
    branch_id: Schema.Types.ObjectId,
    project_map_id?: Schema.Types.ObjectId,
    name: string,
    display_name?: string,
    address1?: string,
    address2?: string,
    region?: string,
    province?: string,
    city?: string,
    barangay?: string,
    zip?: string
    landmark?: string,
    latitude?: string,
    longitude?: string,
    original_owners?: [], // linked to users
    purchase_scheme?: string,
    title_information?: string,
    legal_documentation?: string,
    restrictions?: string,
    terrane_information?: string,
    total_number_of_lots?: Number,
    date_bought?: Date,
    date_begin_selling?: Date,
    date_begin_grading?: Date,
    investment_amount?: Number,
    geographic_layer_file?: string,
    bulk_discount_scheme?: Number,
    LTS?: string,
    project_type ?: string,
    project_status?:string,
    legends?: [],
    active?: boolean,
    total_area: Number,
    acronym?: string,
    titled: boolean,
    description?: string,
    source_titles?: string[],
    inventory: {
        total?: number,
        available?: number,
        reserved?: number,
        sold?: number
    },
    expected: {
        label?: string
    },
    portal?: {
        agent: boolean,
        buyer: boolean,
        admin: boolean
    }
}

const projectSchema = new Schema<Project>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    created_by : { type : Schema.Types.ObjectId, ref: "User"},
    branch_id: {type: Schema.Types.ObjectId, ref: "Branch", default: DEFAULT_BRANCH },
    project_map_id: {type: Schema.Types.ObjectId, ref: "ProjectMap", default: null },
    name : {
        type: String,
        required: [true, "Please provide a name"],
        maxlength:[200, "Name cannot be more than 200 characters"]
    },
    display_name : {
        type: String,
        maxlength:[200, "Display Name cannot be more than 200 characters"],
        default: ""
    },
    address1 : {
        type: String,
        // required: [true, "Please provide an address"],
        maxlength:[255, "Address cannot be more than 255 characters"]
    },
    address2 : {
        type: String,
        // required: [false, "Please provide an address2"],
        maxlength:[255, "Address2 cannot be more than 255 characters"]
    },
    region : {
        type: String,
        // required: [true, "Please provide an region"],
        maxlength:[255, "Region cannot be more than 255 characters"]
    },
    province : {
        type: String,
        // required: [true, "Please provide a province"],
        maxlength:[255, "Province cannot be more than 255 characters"]
    },
    city: {
        type: String,
        // required: [true, "Please provide a city"],
        maxlength:[255, "City cannot be more than 255 characters"]
    },
    barangay:  {
        type: String,
        // required: [true, "Please provide a barangay"],
        maxlength:[255, "Barangay cannot be more than 255 characters"]
    },
    zip: {
        type: String,
        // required: [true, "Please provide a zip"],
        maxlength:[255, "Zip cannot be more than 255 characters"]
    },
    landmark: {
        type: String,
        // required: [true, "Please provide a landmark"],
        maxlength:[255, "Landmark cannot be more than 255 characters"]
    },
    latitude: {
        type: String,
        // required: [true, "Please provide a latitude"],
        maxlength:[255, "Latitude cannot be more than 255 characters"]
    },
    longitude: {
        type: String,
        // required: [true, "Please provide a longitude"],
        maxlength:[255, "Longitude cannot be more than 255 characters"]
    },
    original_owners : [{}],
    purchase_scheme: {
        type: String,
        // required: [true, "Please provide a purchase scheme"],
        maxlength:[255, "Purchase Scheme cannot be more than 255 characters"]
    },
    title_information: {
        type: String,
        // required: [true, "Please provide a purchase scheme"],
        maxlength:[255, "Purchase Scheme cannot be more than 255 characters"]
    },
    legal_documentation: {
        type: String,
        // required: [false, "Please provide a purchase scheme"],
        maxlength:[255, "Purchase Scheme cannot be more than 255 characters"]
    },
    restrictions: {
        type: String,
        // required: [false, "Please provide a purchase scheme"],
    },
    terrane_information: {
        type: String,
        // required: [false, "Please provide a Terrane Information"],
        maxlength:[255, "Terrane information Scheme cannot be more than 255 characters"]
    },
    total_number_of_lots: {
        type: Number,
        // required: [true, "Please provide a number of lots"],
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
    description: {
        type: String,
       default: "",
    },
    source_titles: {
        type: [String],
        default: []
    },
    expected: {
        label: {
            type: String,
            default: ""
        }
    },
    inventory: {
        total: {
            type: Number,
            default: 0
        },
        available: {
            type: Number,
            default: 0
        },
        reserved: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        }
    },
    portal: {
        agent: {type: Boolean, default: false},
        buyer: {type: Boolean, default: false},
        admin: {type: Boolean, default: false}
    }
}, {
    timestamps : true,
    toJSON: { virtuals: true },
})
projectSchema.index({project_map_id: 1})
projectSchema.index({branch_id: 1})
projectSchema.index({active: 1})

const Project: Model<Project> = models.Project || model<Project>("Project", projectSchema,"projects")
export default Project