import dotenv from 'dotenv';

dotenv.config();

console.log('Host is', process.env.HOST)
export default {
    host: process.env.HOST,
    port: Number(process.env.PORT),
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
}
