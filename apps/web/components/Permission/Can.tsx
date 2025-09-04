"use client"
import { useAbility } from "@/hooks/useAbility"
import { useRouter } from "next/navigation"

export function Can({ children, permissions, redirect = false }: { children: React.ReactNode; permissions: string[] | string; redirect?: boolean | string }) {
    const router = useRouter()

    if (typeof permissions === "string") {
        permissions = [permissions]
    }

    if (permissions.length === 0) {
        if (redirect) {
            router.replace(redirect ? "/" : redirect)
        }
        return null
    }

    const ability = useAbility()
    if (permissions.every(permission => !ability.can(permission))) {
        if (redirect) {
            router.replace(redirect ? "/" : redirect)
        }
        return null
    }

    return <>{children}</>
}

export function CanAdmin({ children, permissions = "role:admin" }: { children: React.ReactNode; permissions?: string[] | string }) {

    if(typeof permissions === "string") {
        permissions = [permissions]
    }

    if(permissions.length === 0)  return null
        // return "no access requires " + permissions.join(", ")

    const ability = useAbility()
    if( permissions.every( permission => !ability.can(permission) )  ) return null
        // return "no access requires " + permissions.join(", ")

    return <>{children}</>

}