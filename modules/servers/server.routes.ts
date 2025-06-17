import { Router } from 'express'
import {
  createServer,
  deleteServerById,
  getServerById,
  getServersByUser,
  getUsersServerById,
  joinServer,
} from './server.controller'

const routerServer = Router()

// routerServer.route('/user').get(getUsers)
routerServer.route('/server').post(createServer)
routerServer.route('/server/join').post(joinServer)
routerServer.route('/server/users/:id').get(getUsersServerById)
// routerServer.route('/forgot-password').post(mailForgotPassword)
// routerServer.route('/reset-password/:token').post(resetPassword)
// routerServer.route('/confirm-account/:token').post(confirmAccount)
// routerServer.route('/login').post(login)
routerServer.route('/server/user/:id').get(getServersByUser)
// // .put(updateUser)
// .delete(deleteUser)
routerServer.route('/server/:id').get(getServerById).delete(deleteServerById)

export { routerServer }
