export const TIME_ZONE = "Asia/Manila"
export const DEFAULT_COMPANY = "66da989213b8e3d6f81346d3"
export const DEFAULT_BRANCHES =  [
    {value: "", label: "Select Branch"},
    {value: "6781fd75010710242878129c", label: "Metaland Properties Inc. CEBU"},
    {value: "6781fe29010710242878129d", label: "Metaland Properties Inc. Cagayan de Oro Branch"},
]
export const DEFAULT_BRANCH = "6781fd75010710242878129c"
export const ADMINS_USER_IDS = [
    "67248de75696a245b7ea6f74", // me
    "66e84b26002a6c74dd7b5c84", // richard
    "6731639483c640a5df38e435", // ne kie
    "66de9d2dbeefc238980698ff" // accounting
]

export const ADMINS_USER_OBJECT_IDS = {
    me: "67248de75696a245b7ea6f74", // me
    richard: "66e84b26002a6c74dd7b5c84", // richard
    nekie: "6731639483c640a5df38e435", // ne kie
    nekie2: "6788c0f30984c982c30287fc",
    accounting: "66de9d2dbeefc238980698ff" // accounting
}

export const DEFAULT_USER_IDS = [
"66de9d2dbeefc238980698ff",
"67248de75696a245b7ea6f74",
"66e84b26002a6c74dd7b5c84"
]

export const APPROVER_IDS = {
    finance: "66e84b26002a6c74dd7b5c84", // richard
    operation: "6786196023d84f0fcfd34ab8", // kim
    marketing: "67235b23c50fb3b5aed51725" // lit
}

export const ACCOUNT_TYPE_TEAM_LEAD = "team-agent"
export const MODE_OF_PAYMENT = {
    'Cash' : [],
    'Bank' : [
        'Cheque',
        'Direct Deposit',
        'Online Banking'
    ],
    'Digital Bank' : [],
    'Crypto' : []
}


export enum TABLE {
    LOTS = "lots",
    BLOCKS = "blocks",
    PROJECTS = "projects",
    AMORTIZATIONS = "amortizations",
    COMPANIES = "companies",
    FILES = "files",
    PAYMENTS = "payments",
    REALTIES = "realties",
    RECEIVER_ACCOUNTS = "receiver_accounts",
    SALES_REPORT = "sales_reports",
    USERS = "users",
    VIDEOS = "videos"
}

export const LOT_STATUS = {
    RESERVED: "reserved",
    SOLD: "sold",
    AVAILABLE: "available",
    HOLD: "hold",
}

export enum EnumSOCKET {
    CURRENT_USER = "current-user",
    FUND_REQUEST_INDEX = "fund-request-index",
    FUND_REQUEST_APPROVER_INDEX = "fund-request-approver-index",
    EXPENSE_INDEX = "expense-index",
    PURCHASE_INDEX = "purchase-index",
    PROJECT_BLOCK_INDEX="project-block-index",
    PAYMENT_INDEX="payment-index",
    DEPARTMENT_INDEX="department-index",
    AMORTIZATION_INDEX="amortization-index",
    ROLES_INDEX="roles-index",
    PERMISSIONS_INDEX="permissions-index",
}

export enum LotHistoryAction {
    CREATED,
    UPDATED
}

export const API_URL = {
    USERS: {
        index: "/api/users"
    },
    RESERVATION: {
        index: "/api/amortizations-index"
    },
    AMORTIZATION : {
        index: "/api/amortizations/",
        reservation: "/api/amortizations-file-reservation/",
        disclosure: "/api/amortizations-file-disclosure/",
        sample_disclosure: "/api/amortizations-file-sample-disclosure",
        soa: "/api/amortizations-file-soa/",
        soa_balance: "/api/amortizations-file-soa-balance/",
        prevnext: "/api/amortization-prev-next/",
        no_reservation_date: '/api/data-integrity/no-reservation-date-amortizations',
        running_report: '/api/running-report',
        unlock_commission_sharing: '/api/data-integrity/unlocked-commission-sharing-amortizations',
    },
    PAYMENT: {
        index: "/api/payments",
        no_invoice: "/api/data-integrity/no-invoice-payments",
        commission: "/api/commission-index",
        reference_code: "/api/payments/reference-code-search",
        commission_toggle: "/api/commission-toggle",
    },
    PROJECTS: {
        index: "/api/projects-index",
        blocks: "/api/projects/blocks",
    },
    FUND_REQUEST_APPROVER: {
        index: "/api/fund-approver"
    },
    S3_FILES: {
        index: "/api/s3-files"
    },
    REALTY: {
        agents: "/api/realties"
    },
    TAGS: {
        index: "/api/tags"
    },
    DESCRIPTION_TAGS: {
        index: "/api/description-tags"
    },
    PERMISSION: {
        index: "/api/permissions"
    },
    ROLES: {
        index: "/api/roles"
    },
    COMMISSIONS: {
        index: "/api/commissions",
    },
    REPORTS: {
        MONTHLY_COLLECTIBLE : '/api/reports/monthly-collectibles',
        DELINQUENT_BUYERS : "/api/reports/delinquent-buyers",
        DOUBLE_BOOK: "/api/reports/double-book",
        AGENT_BUYER_AMORTIZATIONS: "/api/reports/agent-buyer-amortizations",
        TAG: "/api/reports/tag-report",
    },
    EXPENSES: {
        index: "/api/expenses-index",
        purchases: "/api/purchases-index",
    }
}
export const DEPARTMENTS = {
    FINANCE: "6781ff268d9ff4647b74eba7"
}

export const EXPENSE_CONST = {
    ids: {
        CASH: "67811175358de7de9385e22e"
    }
}

export const FINANCE_ADMINS = [
    "6788a678c9925faa592a4f01", // anjz
    "67b2a0a62fc8abbae89db8d9", // angelica
    "67248de75696a245b7ea6f74", // me
    "67ca9e718b2a13512abb30c9", // jenefel
    "67dd137ee6cf1549f782e29f", // cherry
    "678ef54a07fb1770c7758e35",// jr
    "66e84b26002a6c74dd7b5c84", // richard
    "6786196023d84f0fcfd34ab8", // kim
    "67235b23c50fb3b5aed51725", // lit
    "67a031c51f16be8d8dfb56b8", // ilyn glory
]

export const FUND_REQUEST_ADMIN_IDS = [
"6788a678c9925faa592a4f01", // anjz
"67b2a0a62fc8abbae89db8d9", // angelica
"67248de75696a245b7ea6f74", // me
"67dd137ee6cf1549f782e29f", // cherry
"66e84b26002a6c74dd7b5c84", // richard
"6786196023d84f0fcfd34ab8", // kim
"67235b23c50fb3b5aed51725", // lit
"680da3adb639c38e9cf500e6" // aaliyah
]

export const FINANCE_ADMIN_IDS = {
    richard: "66e84b26002a6c74dd7b5c84",
    cherry: "67dd137ee6cf1549f782e29f",
    jenefel: "67ca9e718b2a13512abb30c9",
}

export const COMMISSION_ADMIN_IDS = [
    "6788a678c9925faa592a4f01", // anjz
    "67248de75696a245b7ea6f74", // me
    ADMINS_USER_OBJECT_IDS.nekie,
    ADMINS_USER_OBJECT_IDS.nekie2
]