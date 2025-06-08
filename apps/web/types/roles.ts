import { PermissionsMap } from "./permissions";

export interface IRole {
    id?: string,
    name: string,
    description?: string,
    permissions: PermissionsMap,
    company_id?: string,
    deleted: boolean
}