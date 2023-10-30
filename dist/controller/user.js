"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.RegisterUser = void 0;
const user_model_1 = __importDefault(require("../model/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utility_1 = require("../utils/utility");
const RegisterUser = async (req, res) => {
    try {
        const { email, username, phone, password } = req.body;
        const validateRegister = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateRegister.error) {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)(10);
        //Encrypting password
        const userPassword = await (0, utility_1.GeneratePassword)(password, salt);
        const user = await user_model_1.default.findOne({ $or: [{ email }, { username }] });
        if (user) {
            if (user.username === username) {
                return res.status(400).json({ Error: "Username already exists" });
            }
            if (user.email === email) {
                return res.status(400).json({ Error: "User email already exists" });
            }
        }
        //create user
        const newUser = await user_model_1.default.create({
            username,
            email,
            phone,
            password: userPassword,
            role: "user"
        });
        return res.status(201).json({
            message: "User created successfully",
            newUser: newUser
        });
    }
    catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};
exports.RegisterUser = RegisterUser;
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateRegister = utility_1.loginSchema.validate(req.body, utility_1.option);
        if (validateRegister.error) {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        // Find the user by email
        const user = await user_model_1.default.findOne({ email });
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: "Not a registered User" });
        }
        // Compare the password
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        // Generate and return a token if the login is successful
        const token = await (0, utility_1.GenerateToken)({
            id: user.id,
            email: user.email,
            role: '',
        });
        res.status(200).json({ token, user });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.userLogin = userLogin;
