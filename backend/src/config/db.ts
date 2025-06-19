import mongoose from "mongoose"
import { MONGO_LOCAL_HOST_URL } from "../constants/env"

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_LOCAL_HOST_URL)
         console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        process.exit(1)
        
    }
}
export default connectToDatabase