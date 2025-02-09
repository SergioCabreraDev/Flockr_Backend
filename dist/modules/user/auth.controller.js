"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmAccount = exports.resetPassword = exports.mailForgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); // Usar bcryptjs
const crypto_1 = __importDefault(require("crypto")); // Usar bcryptjs
const validations_1 = require("./validations");
const nodemailer_1 = require("./nodemailer/nodemailer");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("./user.model"));
const JWT_SECRET = process.env.JWT_SECRET || 'cabreradominguez';
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentDateTime = new Date();
        const userBody = req.body;
        // 📌 Comprobar si el username o email ya existen en la base de datos
        const existingUser = yield user_model_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ username: userBody.username }, { email: userBody.email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'El nombre de usuario o el correo electrónico ya están en uso.',
            });
        }
        // 📌 Encriptar la contraseña antes de guardarla
        if (userBody.password) {
            const salt = yield bcryptjs_1.default.genSalt();
            userBody.password = yield bcryptjs_1.default.hash(userBody.password, salt);
        }
        else {
            return res.status(400).json({
                message: 'La contraseña es requerida.',
            });
        }
        // 📌 Generar token de confirmación
        const confirmToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(confirmToken).digest('hex');
        // 📌 Crear el usuario en la base de datos con Sequelize
        const savedUser = yield user_model_1.default.create({
            username: userBody.username,
            email: userBody.email,
            password_hash: userBody.password,
            created_at: currentDateTime,
            confirm_account: false,
            confirm_token: hashedToken,
            confirm_TokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expira en 24 horas
        });
        // 📌 Enviar correo de confirmación
        const confirmUrl = `http://localhost:4200/auth/confirm-account/${hashedToken}`;
        yield nodemailer_1.transporter.sendMail({
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
        });
        res
            .status(200)
            .json({ message: 'Usuario registrado. Revisa tu correo para confirmar tu cuenta.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validar entrada
        (0, validations_1.validationLogin)(email, password);
        const existingUser = yield user_model_1.default.findOne({
            where: { email }, // Sequelize usa `where`
        });
        if (!existingUser) {
            return res.status(404).send({ message: 'El usuario no existe' });
        }
        if (!existingUser.confirm_account) {
            return res.status(403).send({
                message: 'Esta cuenta aún no se ha verificado, revisa tu correo electrónico',
            });
        }
        // Comparar contraseñas
        const isValid = yield bcryptjs_1.default.compare(password.trim(), existingUser.password_hash.trim());
        if (!isValid) {
            return res.status(401).send({ message: 'Contraseña incorrecta' });
        }
        // Crear payload para el token
        const payload = {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
        };
        // Opciones del token
        const options = {
            expiresIn: '1h', // Expira en 1 hora
        };
        // Generar el token
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
        res.status(200).send({
            id: existingUser.id,
            email: existingUser.email,
            username: existingUser.username,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
});
exports.login = login;
const mailForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const existingUser = yield user_model_1.default.findOne({
            where: { email }, // 🔥 Sequelize usa `where`
        });
        if (!existingUser) {
            return res.status(404).send({ message: 'Este correo no está registrado.' });
        }
        // Generar token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
        const expiration = new Date(Date.now() + 3600000); // Convertir a Date 1h
        // Guardar el token y la fecha de expiración en la base de datos
        existingUser.reset_PasswordToken = hashedToken;
        existingUser.reset_PasswordExpires = expiration;
        yield existingUser.save();
        // Enviar correo con el enlace
        const resetUrl = `http://localhost:4200/auth/reset-password/${hashedToken}`;
        yield nodemailer_1.transporter.sendMail({
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
        });
        res.status(200).send({ message: 'Correo enviado con éxito.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
exports.mailForgotPassword = mailForgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        const token = req.params.token;
        // Cifrar el token recibido para compararlo con el almacenado
        const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
        // Buscar al usuario con el token y verificar que no haya expirado
        const user = yield user_model_1.default.findOne({
            where: {
                reset_PasswordToken: token,
                reset_PasswordExpires: { [sequelize_1.Op.gt]: Date.now() }, // 🔥 `Op.gt` en lugar de `$gt`
            },
        });
        if (!user) {
            return res.status(400).send({ message: 'Token inválido o expirado.' });
        }
        // Cifrar y actualizar la nueva contraseña
        console.log(password);
        const salt = yield bcryptjs_1.default.genSalt();
        user.password_hash = yield bcryptjs_1.default.hash(password, salt);
        // Limpiar los campos de token y expiración
        user.reset_PasswordToken = undefined;
        user.reset_PasswordExpires = undefined;
        yield user.save();
        res.status(200).send({ message: 'Contraseña restablecida.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});
exports.resetPassword = resetPassword;
const confirmAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { confirmed } = req.body;
    const token = req.params.token;
    // Cifrar el token recibido para compararlo con el almacenado
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    // Buscar al usuario con el token y verificar que no haya expirado
    const user = yield user_model_1.default.findOne({
        where: {
            confirm_token: token, // Compara el token directamente sin cifrar
            confirm_TokenExpires: { [sequelize_1.Op.gt]: Date.now() },
        },
    });
    if (!user) {
        return res.status(400).send({ message: 'Token inválido o expirado.' });
    }
    user.confirm_account = true;
    // Limpiar los campos de token y expiración
    user.confirm_token = undefined;
    user.confirm_TokenExpires = undefined;
    yield user.save();
    res.status(200).send({ message: 'Usuario Confirmado.' });
});
exports.confirmAccount = confirmAccount;
