import { Request, Response } from 'express'
import User from './user.model'

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll()

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
    const userById = await User.findByPk(req.params.id)
    res.status(200).json(userById)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al insertar el usuario' })
  }
}

// const updateUser = async (req: Request, res: Response): Promise<void> => {
//   const updatedName = req.body.name

//   try {
//     await User.update(
//       { name: updatedName }, // Datos a actualizar
//       { where: { id: req.params.id } } // Condición
//     )

//     res.status(200).json({ message: 'Usuario actualizado con éxito', user: updatedName })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: 'Error al actualizar el usuario' })
//   }
// }

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  try {
    const deletedUser = await User.destroy({ where: { id } })

    if (!deletedUser) {
      res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({ message: 'Usuario eliminado con éxito', user: deletedUser })
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el usuario' })
  }
}
const getUsersByIds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ids } = req.query

    if (!ids) {
      res.status(400).json({ message: 'El parámetro "ids" es obligatorio.' })
      return
    }

    // Aseguramos que los ids sean string[]
    const idsArray: string[] =
      typeof ids === 'string'
        ? ids.split(',')
        : Array.isArray(ids)
        ? ids.map((id) => String(id))
        : []

    const users = await User.findAll({
      where: {
        id: idsArray,
      },
    })

    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error al obtener los usuarios', error })
  }
}
export { getUsers, getUserById, deleteUser, getUsersByIds }
