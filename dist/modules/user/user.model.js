"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = require("../../config/db/db.config");
// Modelo de Sequelize
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(32),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    password_hash: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    avatar_url: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    confirm_account: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    confirm_token: {
        type: sequelize_1.DataTypes.CHAR,
        allowNull: true,
    },
    confirm_TokenExpires: {
        type: sequelize_1.DataTypes.DATE, // Cambiado a DataTypes.DATE
        allowNull: true,
    },
    reset_PasswordToken: {
        type: sequelize_1.DataTypes.CHAR,
        allowNull: true,
    },
    reset_PasswordExpires: {
        type: sequelize_1.DataTypes.DATE, // Cambiado a DataTypes.DATE
        allowNull: true,
    },
}, {
    sequelize: db_config_1.sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false, // Desactiva timestamps automáticos si no tienes `updatedAt`
});
exports.default = User;
