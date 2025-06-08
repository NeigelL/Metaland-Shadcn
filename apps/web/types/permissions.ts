export enum EPermissionGroup {
    SYSTEM = "system",
    LOTS = "lots",
    BLOCKS = "blocks",
    PROJECTS = "projects",
    AMORTIZATIONS = "amortizations",
    COMPANIES = "companies",
    FILES = "files",
    FUND_REQUEST = "fund_requests",
    PAYMENTS = "payments",
    REALTIES = "realties",
    RECEIVER_ACCOUNTS = "receiver_accounts",
    // SALES_REPORT = "sales_reports",
    COMMISSIONS = "commissions",
    USERS = "users",
    // VIDEOS = "videos",
    ROLES = "roles",
    PERMISSIONS = "permissions"
}

export interface IPermission {
    id?: string,
    name: string,
    label: string,
    description?: string,
    group: EPermissionGroup,
    company_id?: String | null,
    deleted: boolean
}

export type PermissionsMap = Record<string, boolean>