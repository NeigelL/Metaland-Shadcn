export enum EnumCommissionType {
    TEAM_LEAD = "team_lead",
    TEAM_LEAD_2 = "team_lead_2",
    REALTY_ID = "realty_id",
    AGENT_ID = "agent_id",
    AGENT_ID_2 = "agent_id_2",
    BROKER_ID = "broker_id",
    REMARK = "remark"
}

export enum EnumCommissionModelType {
    User = "User",
    Realty = "Realty",
    Project = "Project",
    Amortization = "Amortization"
}

export enum EnumCommissionActionType {
    FULL_COMM  = "fully-commission-toggle",
    COMMISSION_ENTITY_UPDATED = "commission-entity-updated",
    COMMISSION_SCHEDULE_UPDATED = "commission-schedule-updated",
    COMMISSION_CLEARED = "commission-cleared",
    COMMISSION_REMARK_UPDATED = "commission-remark-updated"
}