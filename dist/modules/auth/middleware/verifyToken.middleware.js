"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = verifyTokenMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_controller_1 = require("../auth.controller");
function verifyTokenMiddleware(req, res, next) {
    const reqToken = req.headers['authorization'];
    if (!reqToken)
        res.status(403).json({ msg: 'Token no existente en la req' });
    jsonwebtoken_1.default.verify(reqToken.split(' ')[1], auth_controller_1.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(401).json({ message: 'Token inválido' });
        req.body.user = decoded;
        next();
    });
}
