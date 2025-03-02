"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerServer = void 0;
const express_1 = require("express");
const server_controller_1 = require("./server.controller");
const routerServer = (0, express_1.Router)();
exports.routerServer = routerServer;
// routerServer.route('/user').get(getUsers)
routerServer.route('/server').post(server_controller_1.createServer);
// routerServer.route('/forgot-password').post(mailForgotPassword)
// routerServer.route('/reset-password/:token').post(resetPassword)
// routerServer.route('/confirm-account/:token').post(confirmAccount)
// routerServer.route('/login').post(login)
routerServer.route('/server/user/:id').get(server_controller_1.getServersByUser);
// // .put(updateUser)
// .delete(deleteUser)
routerServer.route('/server/:id').get(server_controller_1.getServerById).delete(server_controller_1.deleteServerById);
