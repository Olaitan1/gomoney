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
import { createClient  } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
const redisClient = createClient();
import  RedisStore  from 'connect-redis';

export const app = express();

dotenv.config()
// app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
const port = process.env.PORT || 3030;
app.use(bodyParser.urlencoded({ extended: true }));

const sessionStore = new RedisStore({ client: redisClient });
const sessionMiddleware = expressSession({
  store: sessionStore,
  secret: appSecret,
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


