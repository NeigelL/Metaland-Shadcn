"use server"

import Redis from "ioredis"

let redis: Redis | null = null

function getRedisClient(): Redis {
    if (!redis) {
        redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
        redis.on('error', (err) => {
            console.error('Redis connection error:', err);
        });
    }
    return redis
}

export async function getRedisValue(key: string, isJSON: boolean = true): Promise<string | null | any> {
    const client = getRedisClient()
    const result: any = await client.get(key)
    if (result) {
        return isJSON ? JSON.parse(result) : result
    }
    return null
}


export async function setRedisValue(key: string, value: any, isJSON: boolean = true, expirySeconds: number = 60 * 5): Promise<string | null> {
    const client = getRedisClient()
    return await client.set(key, isJSON ? JSON.stringify(value) : value, 'EX', expirySeconds)
}

export async function resetRedisValue(
    key: string, newValue: any, isJSON: boolean = true, expirySeconds: number = 60
) {
    const client = getRedisClient()
    await client.del(key)
    return await client.set(key, isJSON ? JSON.stringify(newValue) : newValue, 'EX', expirySeconds)
}

export async function deleteRedisKey(key: string) {
    const client = getRedisClient()
    return await client.del(key)
}

export async function getOrSetRedisValue(
    key: string, callback: any, isJSON: boolean = true, expirySeconds: number = 60 * 5
) {
    const result = await getRedisValue(key)
    if (result) {
        return result
    }
    const value = await callback()
    await setRedisValue(key, value, isJSON, expirySeconds)
    return value
}