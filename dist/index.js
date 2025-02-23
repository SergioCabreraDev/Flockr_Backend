"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const db_config_1 = require("./config/db/db.config");
const environment_variables_1 = require("./config/environment/environment.variables");
const user_routes_1 = require("./modules/user/user.routes");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
// import { routerAuth } from './modules/auth/auth.routes'
const server = new server_1.default();
server.app.use((0, cors_1.default)());
server.use(body_parser_1.default.json());
server.use(body_parser_1.default.urlencoded({ extended: true }));
(0, db_config_1.connectDB)().then(() => {
    server.app.use('/api', user_routes_1.routerUser);
    server.start(() => {
        console.log(`Servidor Flockr Iniciado | Puerto ${environment_variables_1.SERVER_PORT}`);
    });
});
