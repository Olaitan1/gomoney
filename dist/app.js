"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import cors from 'cors';
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const team_1 = __importDefault(require("./routes/team"));
const fixtures_1 = __importDefault(require("./routes/fixtures"));
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("redis");
const body_parser_1 = __importDefault(require("body-parser"));
exports.app = (0, express_1.default)();
dotenv_1.default.config();
// app.use(cors({ origin: "*" }));
exports.app.use(express_1.default.json());
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use((0, cookie_parser_1.default)());
const port = process.env.PORT || 3030;
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
const Redis = async () => {
    const client = await (0, redis_1.createClient)()
        .on('error', err => console.log('Redis Client Error', err))
        .on('connect', () => console.log("Redis Client connected successfully"))
        .connect();
    await client.set('key', 'value');
    const value = await client.get('key');
    await client.disconnect();
};
Redis();
// const RedisStore = new connectRedis(session)
// //Configure redis client
// const redisClient = createClient({
//   socket: {
//     host: 'localhost',
//     port: 6379
//   }
// })
// redisClient.on('error', function (err) {
//     console.log('Could not establish a connection with redis. ' + err);
// });
// redisClient.on('connect', function (err) {
//     console.log('Connected to redis successfully');
// });
mongoose_1.default.connect(config_1.DB_URL, {
    retryWrites: true,
    w: 'majority'
})
    .then(() => {
    console.log("Successfully connected to MongoDB");
})
    .catch((err) => {
    console.error('Database connection error:', err);
});
exports.app.use('/api', admin_1.default);
exports.app.use('/api/user', user_1.default);
exports.app.use('/api', team_1.default);
exports.app.use('/api', fixtures_1.default);
exports.app.listen(port, () => {
    console.log(`Server Running on Port ${port}`);
});
