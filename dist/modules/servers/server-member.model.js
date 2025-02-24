"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerMember = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = require("../../config/db/db.config");
const server_model_1 = require("./server.model");
const ServerMember = db_config_1.sequelize.define('ServerMember', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    server_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: server_model_1.Server,
            key: 'id',
        },
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'server_members',
    timestamps: false,
});
exports.ServerMember = ServerMember;
server_model_1.Server.hasMany(ServerMember, { foreignKey: 'server_id', onDelete: 'CASCADE' });
ServerMember.belongsTo(server_model_1.Server, { foreignKey: 'server_id' });
