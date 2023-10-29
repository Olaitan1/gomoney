"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res
                .status(401)
                .send("Token missing. Please include a valid token.");
        }
        const decoded = jsonwebtoken_1.default.verify(token, index_1.appSecret);
        req.token = decoded;
        next();
    }
    catch (error) {
        res.status(401).send("Not Authorized, Please authenticate");
    }
};
exports.authMiddleware = authMiddleware;
const Admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ message: 'Not authorized to perform this action' });
    }
};
exports.Admin = Admin;
