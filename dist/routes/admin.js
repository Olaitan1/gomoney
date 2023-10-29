"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controller/admin");
const router = express_1.default.Router();
router.post('/register', admin_1.RegisterAdmin);
router.post('/login', admin_1.AdminLogin);
exports.default = router;
