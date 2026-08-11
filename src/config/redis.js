import {createClient} from '@redis/client';
export const client = createClient({
    url:'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));
await client.connect();

console.log('Redis client connected successfully');

