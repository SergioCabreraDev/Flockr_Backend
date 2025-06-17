import { sequelize } from '../../config/db/db.config'
import { Op } from 'sequelize'
import { Request, Response } from 'express'
import { Friendships } from './friend.model'
import { io } from '../..'

const createFriendship = async (req: Request, res: Response): Promise<any> => {
  const { user1_id, user2_id, status } = req.body

  // Validaciones básicas
  if (!user1_id || !user2_id) {
    return res.status(400).json({ error: 'Ambos IDs de usuario son requeridos' })
  }

  if (user1_id === user2_id) {
    return res.status(400).json({ error: 'Un usuario no puede ser amigo de sí mismo' })
  }

  try {
    // Comprobamos si ya existe la amistad (en cualquier orden)
    const existingFriendship = await Friendships.findOne({
      where: {
        [Op.or]: [
          { user1_id, user2_id },
          { user1_id: user2_id, user2_id: user1_id },
        ],
      },
    })

    if (existingFriendship) {
      return res.status(409).json({ error: 'La amistad ya existe' })
    }

    const newFriendship = await Friendships.create({
      user1_id,
      user2_id,
      status: status || 'pending', // Por defecto puedes poner 'pending'
    })

    res.status(201).json({ message: 'Amistad creada correctamente', friendship: newFriendship })
    console.log(`request-friends/${user2_id}`)

    io.emit(`request-friends/${user2_id}`, {
      eventType: 'request-friends',
      fromUserId: user1_id,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al crear la amistad' })
  }
}

export { createFriendship }
