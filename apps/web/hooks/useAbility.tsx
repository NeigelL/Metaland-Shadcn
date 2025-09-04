"use client"
import { createAbility } from "@/types/ability"
import { PermissionsMap } from "@/types/permissions"
import { useSession } from "next-auth/react"

export function useAbility() {

    const { data: session } = useSession()
    const permissions = session?.permissions || {} as PermissionsMap
    return createAbility(permissions)
}