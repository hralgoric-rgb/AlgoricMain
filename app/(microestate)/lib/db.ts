import mongoose, { Connection } from "mongoose";

type ConnectionObject  = {
    isConnected?: number 
}

const connection: ConnectionObject = {}

async function dbConnect():Promise<void>{
    if (connection.isConnected) {
        console.log("Already Connected To databasae")
     return         
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        // extracting data
        connection.isConnected = db.connections[0].readyState
        console.log("Db connected Sucessfully")
    } catch (error) {
        console.error("Error while Connecting to database Monogodb" , error)
    }
}

export default dbConnect