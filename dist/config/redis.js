"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const Redis = async () => {
    const client = await redis_1.default.createClient({
        socket: {
            host: 'localhost',
            port: 6379
        }
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
    await client.on('connect', () => console.log("Redis Client connected successfully"));
    await client.set('key', 'value');
};
Redis();
