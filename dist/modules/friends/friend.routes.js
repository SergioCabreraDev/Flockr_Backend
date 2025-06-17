"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendshipRouter = void 0;
const express_1 = require("express");
const friend_controller_1 = require("./friend.controller");
const friendshipRouter = (0, express_1.Router)();
exports.friendshipRouter = friendshipRouter;
friendshipRouter.post('/friendships', friend_controller_1.createFriendship);
