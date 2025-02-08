"use strict";
// import { validationLogin } from '../user/validations'
// import { User } from './auth.model'
// import { Request, Response } from 'express'
// import bcrypt from 'bcryptjs'
// const login = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const userBody = req.body
//     validationLogin(userBody.email, userBody.password)
//     console.log(userBody.email)
//     const existingUser = await User.findOne({ email: userBody.email })
//     console.log('Contraseña almacenada:', existingUser?.password)
//     if (!existingUser) {
//       return res.status(404).send({ message: 'User not found' })
//     }
//     console.log('Contraseña ingresada:', userBody.password)
//     console.log('Contraseña almacenada:', existingUser.password)
//     // Usar bcrypt.compare() asincrónico en lugar de compareSync()
//     const isValid = await bcrypt.compare(userBody.password.trim(), existingUser.password.trim())
//     console.log(isValid)
//     if (!isValid) {
//       return res.status(401).send({ message: 'Invalid password' })
//     }
//     res.status(200).send({ message: 'Login successful' })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json(error)
//   }
// }
// export { login }
