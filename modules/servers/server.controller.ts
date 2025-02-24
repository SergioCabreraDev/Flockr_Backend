import { Server } from './server.model'
import { Request, Response } from 'express'
import { sequelize } from '../../config/db/db.config'
import { ServerMember } from './server-member.model'

const createServer = async (req: Request, res: Response): Promise<any> => {
  const transaction = await sequelize.transaction()
  try {
    const { name, owner_id } = req.body

    // Validations
    if (!name || !owner_id) {
      await transaction.rollback()
      return res.status(400).json({ message: 'El nombre y el owner_id son obligatorios.' })
    }

    // Create server
    const server: any = await Server.create(
      {
        name,
        owner_id,
      },
      { transaction }
    )

    // Add owner to server
    await ServerMember.create(
      {
        user_id: owner_id,
        server_id: server.id,
        role: 'owner',
      },
      { transaction }
    )

    await transaction.commit()

    return res.status(201).json({ message: 'Servidor creado con éxito.', server })
  } catch (error) {
    await transaction.rollback()
    console.error('Error al crear el servidor:', error)
    return res.status(500).json({ message: 'Error interno del servidor', error })
  }
}

const getServers = async (req: Request, res: Response): Promise<any> => {
  const transaction = await sequelize.transaction()
  try {
    const { name, owner_id } = req.body

    // Validations
    if (!name || !owner_id) {
      await transaction.rollback()
      return res.status(400).json({ message: 'El nombre y el owner_id son obligatorios.' })
    }

    // Create server
    const server: any = await Server.create(
      {
        name,
        owner_id,
      },
      { transaction }
    )

    // Add owner to server
    await ServerMember.create(
      {
        user_id: owner_id,
        server_id: server.id,
        role: 'owner',
      },
      { transaction }
    )

    await transaction.commit()

    return res.status(201).json({ message: 'Servidor creado con éxito.', server })
  } catch (error) {
    await transaction.rollback()
    console.error('Error al crear el servidor:', error)
    return res.status(500).json({ message: 'Error interno del servidor', error })
  }
}

export { createServer }
