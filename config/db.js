import mongoose from "mongoose";


const connectDB=async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected to mongodb ${connect.connection.host}`)
    } catch (error) {
        console.log(`error in mongodb ${error}`)
    }
}

export default connectDB