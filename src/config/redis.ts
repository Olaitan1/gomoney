import redis from 'redis';


const Redis = async () =>
{
    const client = await redis.createClient({
        socket: {
            host: 'localhost',
            port: 6379
        }
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
 await client.on('connect', () => console.log("Redis Client connected successfully"));
 await client.set('key', 'value');
}

Redis()