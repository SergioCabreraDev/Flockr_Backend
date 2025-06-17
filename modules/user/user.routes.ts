import { Router } from 'express'
import { getUsers, getUserById, deleteUser, getUsersByIds } from './user.controller'
import {
  confirmAccount,
  login,
  mailForgotPassword,
  register,
  resetPassword,
} from '../auth/auth.controller'

const routerUser = Router()


routerUser.route('/user').get(getUsers)
routerUser.route('/register').post(register)
routerUser.route('/forgot-password').post(mailForgotPassword)
routerUser.route('/reset-password/:token').post(resetPassword)
routerUser.route('/confirm-account/:token').post(confirmAccount)
routerUser.route('/login').post(login)
routerUser
  .route('/user/:id')
  .get(getUserById)
  // .put(updateUser)
  .delete(deleteUser)

// ✅ Nueva ruta para obtener varios usuarios por IDs
routerUser.get('/users-by-ids', getUsersByIds)

export { routerUser }
