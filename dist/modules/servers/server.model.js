"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = require("../../config/db/db.config");
const Server = db_config_1.sequelize.define('Server', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    owner_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: 'servers',
    timestamps: false,
});
exports.Server = Server;
