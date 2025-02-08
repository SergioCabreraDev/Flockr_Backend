import { Request, Response } from 'express'
import { User } from './user.model'
import bcrypt from 'bcryptjs' // Usar bcryptjs

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()

    if (users.length === 0) {
      res.status(404).json({ message: 'No se encontraron usuarios' })
      return
    }

    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener usuarios' })
  }
}

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userById = await User.findById(req.params.id)
    res.status(200).json(userById)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al insertar el usuario' })
  }
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const updatedName = req.body.name

  try {
    await User.findByIdAndUpdate(req.params.id, {
      name: updatedName,
    })
    res.status(200).json({ message: 'Usuario actualizado con éxito', user: updatedName })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al actualizar el usuario' })
  }
}

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  try {
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({ message: 'Usuario eliminado con éxito', user: deletedUser })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario' })
  }
}

export { getUsers, getUserById, updateUser, deleteUser }
