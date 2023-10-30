import express from 'express'
import mongoose from 'mongoose';
import { appSecret, DB_URL } from './config';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
// import cors from 'cors';
import adminRouter from './routes/admin'
import userRouter from './routes/user'
import teamRouter from './routes/team'
import fixtureRouter from './routes/fixtures'
import dotenv from 'dotenv';
import { createClient } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import bodyParser from 'body-parser'
export const app = express();

dotenv.config()
// app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
const port = process.env.PORT || 3030;
app.use(bodyParser.urlencoded({ extended: true }));

const Redis = async () =>
{
  const client = await createClient()
    .on('error', err => console.log('Redis Client Error', err))
    .on('connect', () => console.log("Redis Client connected successfully"))

  .connect();

await client.set('key', 'value');
const value = await client.get('key');
await client.disconnect();
}

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

mongoose.connect(DB_URL, {
    retryWrites: true,
    w: 'majority'
})
    .then(() =>
    {
        console.log("Successfully connected to MongoDB");
    })
    .catch((err: Error) => {
        console.error('Database connection error:', err);
    });
app.use('/api', adminRouter)
app.use('/api/user', userRouter)
app.use('/api', teamRouter)
app.use('/api', fixtureRouter)

app.listen(port, () =>
{
    console.log(`Server Running on Port ${port}`)
})


