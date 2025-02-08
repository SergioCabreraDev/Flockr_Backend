"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_variables_1 = require("../config/environment/environment.variables");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = environment_variables_1.SERVER_PORT;
    }
    use(middleware) {
        this.app.use(middleware);
    }
    start(callback) {
        this.app.listen(this.port, callback());
    }
}
exports.default = Server;
