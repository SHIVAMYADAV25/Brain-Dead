import "dotenv/config"
import app from "./index.js";
import { connectDB } from "./config/db.config.js";

const PORT = process.env.PORT || 3000

async function startServer() {
   try {
     await connectDB();
 
     app.listen(3000,()=>{
         console.log(`🚀 Server running on port ${PORT}`);
     })
   } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

startServer();
