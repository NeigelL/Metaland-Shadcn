"use client"
import io, { type Socket} from 'socket.io-client'

let socket : Socket | null = null

export function getClientSocket(): Socket | null {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            autoConnect: true,
        })
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server:', socket?.id)
        })
    }
    return socket
}

export function isSocketConnected() {
    return getClientSocket()?.connected
}


export async function notifySocketServer({event, payload} : {event:string, payload:any}) {
  const socketServerURL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;
  try {
    return await fetch(`${socketServerURL}/broadcast`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({event, payload})
    })
  } catch (error) {
    console.error('Error notifying socket server', error);
  }
}