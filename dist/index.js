"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
// In your main file (where you have the imports)
const server_1 = __importDefault(require("./classes/server"));
const db_config_1 = require("./config/db/db.config");
const environment_variables_1 = require("./config/environment/environment.variables");
const user_routes_1 = require("./modules/user/user.routes");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const server_routes_1 = require("./modules/servers/server.routes");
const friend_routes_1 = require("./modules/friends/friend.routes");
const socket_config_1 = require("./classes/sockets/socket.config");
const http_1 = require("http");
// Initialize your server
const server = new server_1.default();
const httpServer = (0, http_1.createServer)(server.app);
// Middleware
server.app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true,
}));
server.app.use(body_parser_1.default.json());
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
// Initialize Socket.IO and get the io instance
const io = (0, socket_config_1.initializeSocketIO)(httpServer);
exports.io = io;
// Database connection and routes
(0, db_config_1.connectDB)().then(() => {
    server.app.use('/api', user_routes_1.routerUser, server_routes_1.routerServer, friend_routes_1.friendshipRouter);
    // Start the server
    httpServer.listen(environment_variables_1.SERVER_PORT, () => {
        console.log(`Servidor Flockr Iniciado | Puerto ${environment_variables_1.SERVER_PORT}`);
    });
});
