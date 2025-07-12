"use client"

import { getClientSocket, notifySocketServer } from "@/lib/socket";
import { useEffect } from "react";


export default function useSocketListener(eventName: string, callback : (data:any) => void, force: boolean = false) {
    useEffect(() => {
        const socket:any = getClientSocket()
        let exists: boolean = false

        if(!socket) {
            return
        }

        if(!force) {
            for(const key in socket?._callbacks) {
                if (socket?._callbacks && socket?._callbacks["$"+eventName] && socket?._callbacks["$"+eventName]?.length > 0) {
                    exists = true
                    console.log({key, eventName})
                    break
                }
            }
        }
        if(!exists) {
            console.log('Listening to:', eventName)
            socket.on(eventName, callback)
        }

        return () => {
            socket.off(eventName, callback)
        }
    }, [eventName, callback])
}

export function useSocketBroadcast(eventName: string, data : any = {}) {
    console.log('Broadcasting:', eventName)
    return notifySocketServer({event: eventName, payload: data})
}