import mongoose from 'mongoose';

//connect to MondoDB
async function db () {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL as string);
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    }
    catch(err:any) {
        console.log(`Error: ${err.message}`)
    }
}

export default db;