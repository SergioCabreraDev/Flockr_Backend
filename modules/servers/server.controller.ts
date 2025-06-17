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

const getServersByUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: 'El id es obligatorio.' })
    }

    const servers = await ServerMember.findAll({
      where: { user_id: id },
      include: [
        {
          model: Server,
          required: true,
        },
      ],
    })

    return res.status(201).json({ message: 'Servidores recibidos.', servers })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Error al recibir los servidores', error })
  }
}

const getServerById = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.params.id)

    const serverById = await Server.findByPk(req.params.id)
    console.log(serverById)

    res.status(200).json(serverById)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar el servidor' })
  }
}

const deleteServerById = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.params.id)

    const serverById = await Server.destroy({ where: { id: req.params.id } })
    console.log(serverById)

    res.status(200).json(serverById)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar el servidor' })
  }
}

const joinServer = async (req: Request, res: Response): Promise<any> => {
  const transaction = await sequelize.transaction()
  try {
    const { user_id, server_id } = req.body

    // Validations
    if (!user_id || !server_id) {
      await transaction.rollback()
      return res.status(400).json({ message: 'El user_id y el server_id son obligatorios.' })
    }

    // Create JOIN server
    const server: any = await ServerMember.create(
      {
        user_id,
        server_id,
        role: 'member',
      },
      { transaction }
    )

    await transaction.commit()

    return res.status(201).json({ message: 'Usuario unido al servidor con éxito.', server })
  } catch (error) {
    await transaction.rollback()
    console.error('Error al unir el usuario al servidor:', error)
    return res.status(500).json({ message: 'Error interno del servidor', error })
  }
}

const getUsersServerById = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.params.id)

    const serverById = await ServerMember.findAll({ where: { server_id: req.params.id } })
    console.log(serverById)

    res.status(200).json(serverById)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar el servidor' })
  }
}

const generateTokenToInviteServer = async (req: Request, res: Response): Promise<void> => {
  try {
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al buscar el servidor' })
  }
}

export {
  createServer,
  getServersByUser,
  getServerById,
  deleteServerById,
  joinServer,
  getUsersServerById,
}
