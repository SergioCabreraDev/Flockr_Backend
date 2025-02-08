"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationRegister = validationRegister;
exports.validationLogin = validationLogin;
function validationRegister(username, email, password) {
    if (typeof username !== 'string')
        throw new Error('username must be a string');
    if (typeof password !== 'string')
        throw new Error('password must be a string');
    if (typeof email !== 'string')
        throw new Error('email must be a string');
}
function validationLogin(email, password) {
    if (typeof password !== 'string')
        throw new Error('password must be a string');
    if (typeof email !== 'string')
        throw new Error('email must be a string');
}
