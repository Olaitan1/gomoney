"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = exports.createUser = void 0;
const user_model_1 = require("../model/user.model");
const createUser = async (user) => {
    const newUser = await user_model_1.User.create(user);
    return newUser;
};
exports.createUser = createUser;
const getUserByEmail = async (email) => {
    try {
        const user = await user_model_1.User.findOne({ email }).exec();
        return user;
    }
    catch (error) {
        throw new Error("Failed to fetch user by email");
    }
};
exports.getUserByEmail = getUserByEmail;
