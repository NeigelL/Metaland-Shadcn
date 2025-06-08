"use server"

import { auth } from "@/lib/nextAuthOptions"
import { getRedisValue, setRedisValue } from "@/lib/redisFactory"
import Role from "@/models/roles"
import User from "@/models/users"
import { createAbility } from "@/types/ability"
import { PermissionsMap } from "@/types/permissions"

export async function getUserPermissionsService(userId: string, fresh: boolean = false): Promise<PermissionsMap> {
    const redisKey = `user:perm:${userId}`
    if(!fresh) {
        const cachedPermissions = await getRedisValue(redisKey)

        if(cachedPermissions) {
            return cachedPermissions
        }
    }

    const user:any = await User.findById(userId).select("roles override_permissions").lean()

    if(!user) {
        throw new Error("User not found")
    }

    const roles = await Role.find({
        _id: { $in: user?.roles }
    }).lean()

    let permissions: PermissionsMap = {}
    roles.forEach((role) => {
        permissions = { ...permissions, ...role.permissions, ...{["role:"+role.name]: true} }
    })

    let finalPermissions: PermissionsMap = {...permissions, ...user?.override_permissions}

    setRedisValue(redisKey, finalPermissions, true,  60 * 5 ) // cache for 5 minutes
    return finalPermissions;
}

export async function can(permissions: string | string[], userId?: string): Promise<boolean> {
    if(!userId) {
        userId = (await auth())?.user_id
    }
    if(userId) {
        const permissionsMap = await getUserPermissionsService(userId)
        const ability = createAbility(permissionsMap)
        if(typeof permissions === "string") {
            permissions = [permissions]
        }
        if(permissions.length === 0) return false
        return permissions.every( permission => ability.can(permission) )
    }
    return false
}

export async function canServer(permissions: string | string[]) : Promise<boolean> {
    let user_id = (await auth())?.user_id
    return can(permissions, user_id)
}