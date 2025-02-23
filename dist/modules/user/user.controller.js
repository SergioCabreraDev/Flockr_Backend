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
exports.deleteUser = exports.getUserById = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll();
        if (users.length === 0) {
            res.status(404).json({ message: 'No se encontraron usuarios' });
            return;
        }
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userById = yield user_model_1.default.findByPk(req.params.id);
        res.status(200).json(userById);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al insertar el usuario' });
    }
});
exports.getUserById = getUserById;
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
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield user_model_1.default.destroy({ where: { id } });
        if (!deletedUser) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado con éxito', user: deletedUser });
    }
    catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});
exports.deleteUser = deleteUser;
