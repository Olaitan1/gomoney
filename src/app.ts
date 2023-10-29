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
import Redis from 'ioredis'; 
import RedisStore from 'connect-redis';

export const app = express();

dotenv.config()
// app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
const port = process.env.PORT || 3030;



// Configure Redis client
const redisClient = new Redis({
  host: 'localhost', // Redis server host
  port: 6379,        // Redis server port
});
// const RedisStore = new connectRedis(session)
// Configure Redis session store
const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: appSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

app.use(sessionMiddleware);


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


