import { io, Socket } from 'socket.io-client'
import { AuthPayload } from '@/types'

let socket: Socket | null = null

const green = "color: #16a34a; font-weight: bold"
const blue  = "color: #2563eb; font-weight: bold"
const red   = "color: #dc2626; font-weight: bold"

export function getSocket(auth?: AuthPayload) {
  const url = import.meta.env.VITE_SOCKET_URL as string

  if (!socket) {
    socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      auth,
    })

    socket.on("connect", () => console.log("%c🔌 connected: " + socket?.id, green))
    socket.on("disconnect", (r) => console.log("%c🔌 disconnected: " + r, blue))
    socket.on("connect_error", (e) => console.error("%c❌ connect_error: " + e.message, red))
  }
  return socket!
}
