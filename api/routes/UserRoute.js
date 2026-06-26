import express from 'express';
import { test, updateUser } from '../controllers/UserController.js';
import { verifyToken } from '../utils/verifyUser.js';

const UserRouter = express.Router();
UserRouter.get('/test',test);
UserRouter.post('/update/:id',verifyToken, updateUser);
UserRouter.post('/delete/:id',verifyToken, deleteUser );



export default UserRouter;