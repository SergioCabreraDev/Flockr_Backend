import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { ClientToServerEvents, ServerToClientEvents, SocketData } from './socket.type'

export function initializeSocketIO(httpServer: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:4200', // Cambiado a 4200 (puerto default de Angular)
      methods: ['GET', 'POST'],
      credentials: true,
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutos
      skipMiddlewares: true,
    },
  })
  console.log('🚀 Socket.IO initialized on server')

  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`)

    // Register event handlers
    registerSocketHandlers(io, socket)

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`)
    })
  })

  return io
}

function registerSocketHandlers(io: Server, socket: Socket) {
  // Basic ping-pong
  socket.on('ping', (callback) => {
    console.log('Received ping from', socket.id)
    if (typeof callback === 'function') {
      callback('pong')
    }
  })

  // Add more handlers here or import from separate files
}
