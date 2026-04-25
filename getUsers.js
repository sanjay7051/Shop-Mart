import mongoose from 'mongoose';
import connectDB from './server/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const getUser = async () => {
    await connectDB();
    const { User } = await import('./server/db.js');
    const users = await User.find({});
    console.log("Users:", users);
    process.exit(0);
}
getUser();
