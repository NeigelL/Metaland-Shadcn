import { DEFAULT_COMPANY } from "@/serverConstant"
import  { Schema, models, model, Model } from "mongoose"


export enum EPolygonType {
    PROJECT = "project",
    BLOCK = "block",
    LOT = "lot",
    ROAD = "road",
    MISC = "misc",
    LABEL = "label"
}
export interface IPolygon {
    company_id: Schema.Types.ObjectId,
    created_by: Schema.Types.ObjectId,
    project_id: Schema.Types.ObjectId,
    project_map_id: Schema.Types.ObjectId,
    block_id: Schema.Types.ObjectId,
    lot_id: Schema.Types.ObjectId,
    label: string,
    description: string,
    coordinates: [{
        lat: Number,
        lng: Number
    }],
    centerCoordinates: {
        style: Object,
        lat: Number,
        lng: Number
    },
    type: string
}

const polygonSchema = new Schema<IPolygon>({
    company_id : { type : Schema.Types.ObjectId, ref: "Company", default: DEFAULT_COMPANY },
    created_by: { type : Schema.Types.ObjectId, required : true , ref: "User"},
    project_id: { type : Schema.Types.ObjectId, required : true , ref: "Project"},
    project_map_id: { type : Schema.Types.ObjectId, default : null , ref: "ProjectMap"},
    block_id: { type : Schema.Types.ObjectId, default : null , ref: "Block"},
    lot_id: { type : Schema.Types.ObjectId, default : null , ref: "Lot"},
    label: { type: String, default: "" },
    description: { type: String, default: "" },
    coordinates: [{type: {}}],
    centerCoordinates: { type: {} },
    type: {type: String, required: true , default: EPolygonType.LOT }
},{
    timestamps : true,
    toJSON: {
        virtuals: true
    }
})


polygonSchema.index({project_id: 1})
polygonSchema.index({project_map_id: 1})
polygonSchema.index({block_id: 1})
polygonSchema.index({lot_id: 1})
polygonSchema.index({type: 1})


const Polygon:Model<IPolygon> = models?.Polygon || model<IPolygon>("Polygon",polygonSchema,"polygons")
export default Polygon