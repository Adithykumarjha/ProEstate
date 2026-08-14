import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserRouter from './routes/UserRoute.js';
import authRouter from './routes/authRoute.js';
import listingRouter from './routes/listingRoute.js'
import cookieParser from 'cookie-parser';
import cloudinaryRoutes from './routes/cloudinaryRoute.js';
import path from 'path';

dotenv.config();
mongoose.connect(process.env.MONGODB_CONNECT).then (()=>{
  console.log('Connected to mongodb');
}).catch((err)=>{
  console.log(err);
});

const dirname = path.resolve();

const app=express();
app.use(express.json());

app.use(cookieParser());

const PORT=3000;
app.listen(PORT,()=>{
  console.log(`Server is running on port: ${PORT}`);
});

app.use('/api/user',UserRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);
app.use('/api/cloudinary', cloudinaryRoutes);

app.use(express.static(path.join(dirname,'/client/dist')));

app.get('*', (req,res) =>{
  res.sendFile(path.join(dirname, 'client','dist','index.html'));
})

app.get('*', (req,res) =>{
  res.sendFile(path.join(dirname, 'client','dist','index.html'));
})


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
