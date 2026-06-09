import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './routes/UserRoute.js';
import authRouter from './routes/authRoute.js';
dotenv.config();
mongoose.connect(process.env.MONGODB_CONNECT).then (()=>{
  console.log('Connected to mongodb');
}).catch((err)=>{
  console.log(err);
});

const app=express();
app.use(express.json());

const PORT=3000;
app.listen(PORT,()=>{
  console.log(`Server is running on port: ${PORT}`);
});

app.use('/api/user',UserRouter);
app.use('/api/auth',authRouter);


// error middleware
app.use((err,req,resizeBy,next)=>{
  const statusCode=err.statusCode|| 500;
  const message=err.message || 'Internal Server Error';

  return resizeBy.status(statusCode).json({
    success:false,
    statusCode,
    message
  });
});
