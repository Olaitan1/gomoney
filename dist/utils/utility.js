"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adminschema = exports.updateSchema = exports.validatePassword = exports.loginSchema = exports.verifyToken = exports.GenerateToken = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.teamSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    confirm_password: joi_1.default.any()
        .required()
        .valid(joi_1.default.ref("password"))
        .label("confirm password")
        .messages({ "any.only": "passwords do not match" }),
    //.messages({ "any.only": "{{#label}} does not match with password" }),
});
exports.teamSchema = joi_1.default.object({
    teamName: joi_1.default.string().min(3).required(),
    sport: joi_1.default.string().min(3).required(),
    homeCity: joi_1.default.string().min(3).required(),
    homeStadium: joi_1.default.string().min(3).required(),
    country: joi_1.default.string().min(3).required(),
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
const GenerateSalt = async (rounds) => {
    const salt = await bcrypt_1.default.genSalt(rounds);
    return salt;
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    const hash = await bcrypt_1.default.hash(password, salt);
    return hash;
};
exports.GeneratePassword = GeneratePassword;
const GenerateToken = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.appSecret, { expiresIn: '1d' });
};
exports.GenerateToken = GenerateToken;
const verifyToken = async (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.appSecret);
};
exports.verifyToken = verifyToken;
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
//password validation
const validatePassword = async (inputPassword, savedPassword, salt) => {
    return await (0, exports.GeneratePassword)(inputPassword, salt) === savedPassword;
};
exports.validatePassword = validatePassword;
exports.updateSchema = joi_1.default.object().keys({
    address: joi_1.default.string().required(),
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    phone: joi_1.default.string().required()
});
exports.Adminschema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
