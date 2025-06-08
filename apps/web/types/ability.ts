import { PermissionsMap } from "./permissions";

export interface Ability {
    can: (permission:string) => boolean;
    canEditField: (permission:string) => boolean;
}

export function createAbility(permissions: PermissionsMap ): Ability {
    return {
        can: (permission: string) => {
            return permissions[permission] || false;
        },
        canEditField: (permission: string) => {
            return permissions[permission] || false;
        }
    }
}