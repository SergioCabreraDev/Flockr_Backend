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
exports.getServersByUser = exports.createServer = void 0;
const server_model_1 = require("./server.model");
const db_config_1 = require("../../config/db/db.config");
const server_member_model_1 = require("./server-member.model");
const createServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield db_config_1.sequelize.transaction();
    try {
        const { name, owner_id } = req.body;
        // Validations
        if (!name || !owner_id) {
            yield transaction.rollback();
            return res.status(400).json({ message: 'El nombre y el owner_id son obligatorios.' });
        }
        // Create server
        const server = yield server_model_1.Server.create({
            name,
            owner_id,
        }, { transaction });
        // Add owner to server
        yield server_member_model_1.ServerMember.create({
            user_id: owner_id,
            server_id: server.id,
            role: 'owner',
        }, { transaction });
        yield transaction.commit();
        return res.status(201).json({ message: 'Servidor creado con éxito.', server });
    }
    catch (error) {
        yield transaction.rollback();
        console.error('Error al crear el servidor:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error });
    }
});
exports.createServer = createServer;
const getServersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'El id es obligatorio.' });
        }
        const servers = yield server_member_model_1.ServerMember.findAll({
            where: { user_id: id },
            include: [
                {
                    model: server_model_1.Server,
                    required: true,
                },
            ],
        });
        return res.status(201).json({ message: 'Servidores recibidos.', servers });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al recibir los servidores', error });
    }
});
exports.getServersByUser = getServersByUser;
