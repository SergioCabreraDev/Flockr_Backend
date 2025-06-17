// In your main file (where you have the imports)
import Server from './classes/server'
import { connectDB } from './config/db/db.config'
import { SERVER_PORT } from './config/environment/environment.variables'
import { routerUser } from './modules/user/user.routes'
import bodyParser from 'body-parser'
import cors from 'cors'
import { routerServer } from './modules/servers/server.routes'
import { friendshipRouter } from './modules/friends/friend.routes'
import { initializeSocketIO } from './classes/sockets/socket.config'
import { createServer } from 'http'

// Initialize your server
const server = new Server()
const httpServer = createServer(server.app)

// Middleware
server.app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true,
  })
)
server.app.use(bodyParser.json())
server.app.use(bodyParser.urlencoded({ extended: true }))

// Initialize Socket.IO and get the io instance
const io = initializeSocketIO(httpServer)

// Database connection and routes
connectDB().then(() => {
  server.app.use('/api', routerUser, routerServer, friendshipRouter)

  // Start the server
  httpServer.listen(SERVER_PORT, () => {
    console.log(`Servidor Flockr Iniciado | Puerto ${SERVER_PORT}`)
  })
})

export { io }
