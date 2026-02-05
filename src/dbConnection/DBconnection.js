import mongoose from "mongoose";

const DB_URL = process.env.DB_URL;

async function ConnectDB (){
    try {
        const connectionInstance = await mongoose.connect(DB_URL);
        console.log(`this DB is connected to ${connectionInstance.connection.port}`);
        
    } catch (error) {
        console.log("Error while connecting to DB", error);
        process.exit(1);
    }
}


export default ConnectDB;