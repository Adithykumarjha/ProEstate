import express from 'express';
import { createListing } from '../controllers/ListingController.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken,createListing);