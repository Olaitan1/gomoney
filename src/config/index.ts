import dotenv from 'dotenv'


dotenv.config()

export const DB_URL = process.env.DB_URL as string
export const appSecret = process.env.appSecret as string;