import dotenv from "dotenv"
dotenv.config()
export const port = process.env.PORT
export const mongoURI = process.env.MONGO_DB_URI
