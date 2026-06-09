import express from 'express';
import { test } from '../controllers/UserController.js';

const UserRouter = express.Router();
UserRouter.get('/test',test);


export default UserRouter;