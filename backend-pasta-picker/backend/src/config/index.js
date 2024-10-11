import dotenv from "dotenv"
dotenv.config()
export const port = process.env.PORT
export const mongoURI = process.env.MONGO_DB_URI
export const payMongoSecretKey = process.env.PAYMONGO_SECRET_KEY
export const payMongoApiUrl = process.env.PAYMONGO_API_URL
