"use client"
import { useAbility } from "@/hooks/useAbility"

export function canFn(permissions: string | string[]) {
    if(typeof permissions === "string") {
        permissions = [permissions]
    }
    if(permissions.length === 0) return false
    const ability = useAbility()
    return permissions.every( permission => ability.can(permission) )
}
