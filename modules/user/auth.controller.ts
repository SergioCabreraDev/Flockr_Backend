import { Request, Response } from 'express'

import bcrypt from 'bcryptjs' // Usar bcryptjs
import crypto from 'crypto' // Usar bcryptjs
import { validationLogin } from './validations'
import { transporter } from './nodemailer/nodemailer'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import User from './user.model'

const JWT_SECRET = process.env.JWT_SECRET || 'cabreradominguez'

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentDateTime = new Date()
    const userBody = req.body

    // 📌 Comprobar si el username o email ya existen en la base de datos
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username: userBody.username }, { email: userBody.email }],
      },
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'El nombre de usuario o el correo electrónico ya están en uso.',
      })
    }

    // 📌 Encriptar la contraseña antes de guardarla
    if (userBody.password) {
      const salt = await bcrypt.genSalt()
      userBody.password = await bcrypt.hash(userBody.password, salt)
    } else {
      return res.status(400).json({
        message: 'La contraseña es requerida.',
      })
    }

    // 📌 Generar token de confirmación
    const confirmToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(confirmToken).digest('hex')

    // 📌 Crear el usuario en la base de datos con Sequelize
    const savedUser = await User.create({
      username: userBody.username,
      email: userBody.email,
      password_hash: userBody.password,
      created_at: currentDateTime,
      confirm_account: false,
      confirm_token: hashedToken,
      confirm_TokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expira en 24 horas
    })

    // 📌 Enviar correo de confirmación
    const confirmUrl = `http://localhost:4200/auth/confirm-account/${hashedToken}`
    await transporter.sendMail({
      to: userBody.email,
      subject: 'Confirmación de Cuenta',
      html: `
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
        <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <tr>
            <td align="center" style="padding: 10px 0;">
              <img src="https://i.imgur.com/n68leRe.png" alt="Logo de la Empresa" style="max-width: 150px;">
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; padding: 20px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">
                Hola ${savedUser.username}, antes de terminar el registro confirma tu cuenta.
              </h1>
              <p style="margin-bottom: 30px; text-align: center;">
                Te has registrado en <a href="https://maps.app.goo.gl/fCJLywCQ9zTSkyuz5">Flockr.com</a>. Haz clic en el botón de abajo para confirmar tu cuenta:
              </p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${confirmUrl}" style="display: inline-block; background-color: #a370f0; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold;">
                      Confirmar Cuenta
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin-top: 30px; font-size: 14px; text-align: center;">
                Si no has sido tú, puedes ignorar este correo electrónico.
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 30px; color: #888888; font-size: 12px;">
              <p>&copy; 2025 Flockr. Todos los derechos reservados.</p>
              <p>
                <a href="#" style="color: #a370f0; text-decoration: none;">Política de Privacidad</a> |
                <a href="#" style="color: #a370f0; text-decoration: none;">Términos de Servicio</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
      `,
    })

    res
      .status(200)
      .json({ message: 'Usuario registrado. Revisa tu correo para confirmar tu cuenta.' })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body

    // Validar entrada
    validationLogin(email, password)

    const existingUser = await User.findOne({
      where: { email }, // Sequelize usa `where`
    })

    if (!existingUser) {
      return res.status(404).send({ message: 'El usuario no existe' })
    }

    if (!existingUser.confirm_account) {
      return res.status(403).send({
        message: 'Esta cuenta aún no se ha verificado, revisa tu correo electrónico',
      })
    }

    // Comparar contraseñas
    const isValid = await bcrypt.compare(password.trim(), existingUser.password_hash.trim())
    if (!isValid) {
      return res.status(401).send({ message: 'Contraseña incorrecta' })
    }

    // Crear payload para el token
    const payload = {
      id: existingUser.id,
      username: existingUser.username,
      email: existingUser.email,
    }

    // Opciones del token
    const options: jwt.SignOptions = {
      expiresIn: '1h', // Expira en 1 hora
    }

    // Generar el token
    const token = jwt.sign(payload, JWT_SECRET, options)

    res.status(200).send({
      id: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
      token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el servidor', error })
  }
}

const mailForgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body

    const existingUser = await User.findOne({
      where: { email }, // 🔥 Sequelize usa `where`
    })
    if (!existingUser) {
      return res.status(404).send({ message: 'Este correo no está registrado.' })
    }

    // Generar token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    const expiration = new Date(Date.now() + 3600000) // Convertir a Date 1h

    // Guardar el token y la fecha de expiración en la base de datos
    existingUser.reset_PasswordToken = hashedToken
    existingUser.reset_PasswordExpires = expiration
    await existingUser.save()

    // Enviar correo con el enlace
    const resetUrl = `http://localhost:4200/auth/reset-password/${hashedToken}`
    await transporter.sendMail({
      to: email,
      subject: 'Reinicio de Contraseña',
      html: `
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0;">
        <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <tr>
            <td align="center" style="padding: 10px 0;">
              <img src="https://i.imgur.com/n68leRe.png" alt="Logo de la Empresa" style="max-width: 150px;">
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; padding: 20px 30px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">Reinicio de Contraseña</h1>
              <p style="margin-bottom: 30px; text-align: center;">
                Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:
              </p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" style="display: inline-block; background-color: #a370f0; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 4px; font-weight: bold;">Restablecer Contraseña</a>
                  </td>
                </tr>
              </table>
              <p style="margin-top: 30px; font-size: 14px; text-align: center;">
                Si no has solicitado este cambio, puedes ignorar este correo electrónico.
              </p>
            </td>
          </tr>
          <tr>
            <td style="text-align: center; padding-top: 30px; color: #888888; font-size: 12px;">
              <p>&copy; 2025 Flockr. Todos los derechos reservados.</p>
              <p>
                <a href="#" style="color: #a370f0; text-decoration: none;">Política de Privacidad</a> |
                <a href="#" style="color: #a370f0; text-decoration: none;">Términos de Servicio</a>
              </p>
            </td>
          </tr>
        </table>
      </body>
      `,
    })

    res.status(200).send({ message: 'Correo enviado con éxito.' })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const password = req.body.password
    const token = req.params.token

    // Cifrar el token recibido para compararlo con el almacenado
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Buscar al usuario con el token y verificar que no haya expirado

    const user = await User.findOne({
      where: {
        reset_PasswordToken: token,
        reset_PasswordExpires: { [Op.gt]: Date.now() }, // 🔥 `Op.gt` en lugar de `$gt`
      },
    })

    if (!user) {
      return res.status(400).send({ message: 'Token inválido o expirado.' })
    }

    // Cifrar y actualizar la nueva contraseña
    console.log(password)
    const salt = await bcrypt.genSalt()
    user.password_hash = await bcrypt.hash(password, salt)

    // Limpiar los campos de token y expiración
    user.reset_PasswordToken = undefined
    user.reset_PasswordExpires = undefined

    await user.save()
    res.status(200).send({ message: 'Contraseña restablecida.' })
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
}

const confirmAccount = async (req: Request, res: Response): Promise<any> => {
  const { confirmed } = req.body
  const token = req.params.token
  // Cifrar el token recibido para compararlo con el almacenado
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  // Buscar al usuario con el token y verificar que no haya expirado
  const user = await User.findOne({
    where: {
      confirm_token: token, // Compara el token directamente sin cifrar
      confirm_TokenExpires: { [Op.gt]: Date.now() },
    },
  })

  if (!user) {
    return res.status(400).send({ message: 'Token inválido o expirado.' })
  }

  user.confirm_account = true

  // Limpiar los campos de token y expiración
  user.confirm_token = undefined
  user.confirm_TokenExpires = undefined

  await user.save()
  res.status(200).send({ message: 'Usuario Confirmado.' })
}

export { register, login, mailForgotPassword, resetPassword, confirmAccount }
