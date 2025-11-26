import "reflect-metadata"
import { DataSource } from "typeorm"
import { URL_ENTRY,LAST } from "./entity/URL_ENTRY"
import dotenv from 'dotenv'
dotenv.config()
export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    synchronize: true,
    logging: false,
    entities: [URL_ENTRY,LAST],
    migrations: [],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false
    }
})
