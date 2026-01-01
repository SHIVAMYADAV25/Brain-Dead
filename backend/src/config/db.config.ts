import mongoose from "mongoose";
import "dotenv/config"

const mongo_url = process.env.MONGO_DB_URL;

if(!mongo_url){
    throw new Error("MONGO DB URL required")
}

export const connectDB = async () => {
    try {
        const connectionInstance  = await mongoose.connect(mongo_url);
        console.log(`\n MongoDB connected !! DB host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection Failed",error);
        process.exit(1);
    }
}