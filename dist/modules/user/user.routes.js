"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerUser = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_controller_1 = require("../auth/auth.controller");
const routerUser = (0, express_1.Router)();
exports.routerUser = routerUser;
routerUser.route('/user').get(user_controller_1.getUsers);
routerUser.route('/register').post(auth_controller_1.register);
routerUser.route('/forgot-password').post(auth_controller_1.mailForgotPassword);
routerUser.route('/reset-password/:token').post(auth_controller_1.resetPassword);
routerUser.route('/confirm-account/:token').post(auth_controller_1.confirmAccount);
routerUser.route('/login').post(auth_controller_1.login);
routerUser
    .route('/user/:id')
    .get(user_controller_1.getUserById)
    // .put(updateUser)
    .delete(user_controller_1.deleteUser);
// ✅ Nueva ruta para obtener varios usuarios por IDs
routerUser.get('/users-by-ids', user_controller_1.getUsersByIds);
