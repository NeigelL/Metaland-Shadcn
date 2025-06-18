import { IUser } from "@/models/interfaces/users";

export const loginUser : IUser  & {
    user: {
        name: string | null;
        email: string | null;
        picture: string | null;
        image: string | null;
    },
    user_id: string | null;
    permissions: Record<string, any>;
    _id: string | null;
    sub: string | null;
    iat: number;
    exp: number;
    jti: string;
} = {
    user: {
        name: null,
        email: null,
        picture: null,
        image: null,
    },
    company_id: null,
    first_name: null,
    middle_name: null,
    last_name: null,
    address: null,
    region: null,
    province: null,
    city: null,
    barangay: null,
    zip: null,
    email: null,
    account_type: null,
    phone: null,
    references: [],
    bank_accounts: [],
    roles: [],
    override_permissions: {},
    active: false,
    login: false,
    emailGenerated: false,
    user_id: null,
    permissions: {},
    _id: null,
    sub: null,
    iat: 0,
    exp: 0,
    jti: ""
}