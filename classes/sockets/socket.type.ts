import { Socket } from 'socket.io'

// Define your event types for better type safety
export interface ClientToServerEvents {
  ping: (callback: (response: string) => void) => void
  send_message: (message: ChatMessage) => void
  join_room?: (roomId: string) => void
}

export interface ServerToClientEvents {
  pong?: (response: string) => void
  new_message?: (message: ChatMessage) => void
  room_joined?: (roomId: string) => void

  [event: `request-friends/${string}`]: (payload: {
    eventType: string
    fromUserId: string
    created_at: string
  }) => void
}

export interface SocketData {
  userId?: string
  username?: string
  rooms: string[]
}

export interface ChatMessage {
  text: string
  sender: string
  timestamp: Date
}

// Extend Socket interface if needed
declare module 'socket.io' {
  interface Socket {
    user?: {
      id: string
      name: string
    }
  }
}
