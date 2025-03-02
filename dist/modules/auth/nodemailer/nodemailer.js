"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'flockr.socialnetwork@gmail.com',
        pass: 'zzzh jsne bymb ydgx',
    },
});
exports.transporter = transporter;
