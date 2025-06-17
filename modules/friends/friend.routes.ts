import { Router } from 'express'
import { createFriendship } from './friend.controller'

const friendshipRouter = Router()

friendshipRouter.post('/friendships', createFriendship)

export { friendshipRouter }
