"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const test_controller_1 = require("./test.controller");
const router = (0, express_1.Router)();
exports.router = router;
router.get('/test', test_controller_1.getTest);
