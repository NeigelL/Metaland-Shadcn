"use server"

import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function getRedisValue(key:string, isJSON: boolean = true) : Promise<string | null | any> {
    const result:any = await redis.get(key)
    if (result) {
        return isJSON ? JSON.parse(result) : result
    }
    return null
}


export async function setRedisValue(key:string, value:any, isJSON : boolean = true, expirySeconds: number = 60 * 5) : Promise<string | null> {
    return await redis.set(key, isJSON ? JSON.stringify(value) : value, 'EX', expirySeconds)
}

export async function resetRedisValue(
    key:string,newValue:any, isJSON : boolean = true, expirySeconds: number = 60
) {
    await redis.del(key)
    return await redis.set(key, isJSON ? JSON.stringify(newValue) : newValue, 'EX', expirySeconds)
}

export async function deleteRedisKey(key:string) {
    return await redis.del(key)
}

export async function getOrSetRedisValue(
    key:string, callback:any, isJSON : boolean = true, expirySeconds: number = 60 * 5
) {
    const result = await getRedisValue(key)
    // if (result) {
    //     return result
    // }
    const value = await callback()
    await setRedisValue(key, value, isJSON, expirySeconds)
    return value
}