"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define the schema for the sports team
const teamSchema = new mongoose_1.default.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
    },
    sport: {
        type: String,
        required: true,
    },
    homeCity: String,
    homeStadium: String,
    championships: {
        type: Number,
        default: 0,
    },
    country: String,
    players: [
        {
            playerName: String,
            position: String,
        },
    ],
    founded: {
        type: Date,
        default: Date.now,
    },
});
exports.Team = mongoose_1.default.model('Team', teamSchema);
