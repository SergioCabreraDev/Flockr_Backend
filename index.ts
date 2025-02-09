import Server from './classes/server'
import { connectDB } from './config/db/db.config'
import { SERVER_PORT } from './config/environment/environment.variables'
import { routerUser } from './modules/user/user.routes'

import bodyParser from 'body-parser'
import cors from 'cors'
// import { routerAuth } from './modules/auth/auth.routes'

const server = new Server()

server.app.use(cors())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))

connectDB().then(() => {
  server.app.use('/api', routerUser)

  server.start(() => {
    console.log(`Servidor Flockr Iniciado | Puerto ${SERVER_PORT}`)
  })
})
