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
exports.connectDB = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const environment_variables_1 = require("../environment/environment.variables");
const dbUri = process.env.POSTGRES_URI || environment_variables_1.POSTGRES_URI; // URL de conexión
const sequelize = new sequelize_1.Sequelize(dbUri, {
    dialect: 'postgres',
    logging: false,
});
exports.sequelize = sequelize;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('\x1b[32m', 'Conexión a PostgreSQL exitosa');
    }
    catch (error) {
        console.log('\x1b[31m', 'Error al conectar a PostgreSQL:', error);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
