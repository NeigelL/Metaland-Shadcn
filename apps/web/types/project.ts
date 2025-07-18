
export interface IProject {
    company_id: String,
    created_by: String,
    branch_id: String,
    name: string,
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
    portal?: {
        agent: boolean,
        buyer: boolean,
        admin: boolean
    }
}