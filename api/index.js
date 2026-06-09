import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './routes/UserRoute.js';
dotenv.config();
mongoose.connect(process.env.MONGODB_CONNECT).then (()=>{
  console.log('Connected to mongodb');
}).catch((err)=>{
  console.log(err);
});
const app=express();
const PORT=3000;
app.listen(PORT,()=>{
  console.log(`Server is running on port: ${PORT}`);
});

app.use('/api/user',UserRouter);
