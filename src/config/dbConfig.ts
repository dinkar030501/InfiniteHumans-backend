import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.APP_MODE === "LOCAL"
                ? process.env.LOCAL_MONGODB_URI
                : process.env.PROD_MONGODB_URI
        )
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
    }
}
