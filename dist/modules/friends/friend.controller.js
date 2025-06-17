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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFriendship = void 0;
const sequelize_1 = require("sequelize");
const friend_model_1 = require("./friend.model");
const __1 = require("../..");
const createFriendship = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user1_id, user2_id, status } = req.body;
    // Validaciones básicas
    if (!user1_id || !user2_id) {
        return res.status(400).json({ error: 'Ambos IDs de usuario son requeridos' });
    }
    if (user1_id === user2_id) {
        return res.status(400).json({ error: 'Un usuario no puede ser amigo de sí mismo' });
    }
    try {
        // Comprobamos si ya existe la amistad (en cualquier orden)
        const existingFriendship = yield friend_model_1.Friendships.findOne({
            where: {
                [sequelize_1.Op.or]: [
                    { user1_id, user2_id },
                    { user1_id: user2_id, user2_id: user1_id },
                ],
            },
        });
        if (existingFriendship) {
            return res.status(409).json({ error: 'La amistad ya existe' });
        }
        const newFriendship = yield friend_model_1.Friendships.create({
            user1_id,
            user2_id,
            status: status || 'pending', // Por defecto puedes poner 'pending'
        });
        res.status(201).json({ message: 'Amistad creada correctamente', friendship: newFriendship });
        console.log(`request-friends/${user2_id}`);
        __1.io.emit(`request-friends/${user2_id}`, {
            eventType: 'request-friends',
            fromUserId: user1_id,
            created_at: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la amistad' });
    }
});
exports.createFriendship = createFriendship;
