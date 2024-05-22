import dotenv from 'dotenv';
import mongoose from 'mongoose';

export async function connectDb() {

    if (mongoose.connection.readyState >= 1) {
        console.log("already connected to MongoDB")
        return;
    }

    mongoose.connect(`mongodb+srv://tylerodouglas:J7zjUwb6uggogrPP@groq-project.eq3evzl.mongodb.net/?retryWrites=true&w=majority&appName=groq-project`, { 
    useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to MongoDB")
    })
    .catch(err => {
        console.log("Failed to connect to MongoDB")
        console.log(err)
    })

}