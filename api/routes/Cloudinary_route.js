import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/signature', verifyToken, (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = {
    timestamp,
    upload_preset: 'proEstate',
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
});

export default router;