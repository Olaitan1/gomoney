import mongoose from 'mongoose';
import { Schema, Types, model } from "mongoose";
import { IUser } from "../interface/user.dto"

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum:['admin', 'user']
    }
},
    { timestamps: true });

   const User = model<IUser>("User", userSchema);
export default User;
