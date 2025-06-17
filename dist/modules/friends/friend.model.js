"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Friendships = void 0;
const sequelize_1 = require("sequelize");
const db_config_1 = require("../../config/db/db.config");
const user_model_1 = __importDefault(require("../user/user.model"));
const Friendships = db_config_1.sequelize.define('friendships', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user1_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    user2_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    tableName: 'friendships',
    timestamps: false,
});
exports.Friendships = Friendships;
Friendships.belongsTo(user_model_1.default, { foreignKey: 'user1_id', as: 'user1' });
Friendships.belongsTo(user_model_1.default, { foreignKey: 'user2_id', as: 'user2' });
