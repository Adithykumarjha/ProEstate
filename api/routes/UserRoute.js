import express, { Router } from 'express';
import { test, updateUser, getUserListings, getUser} from '../controllers/UserController.js';
import { verifyToken } from '../utils/verifyUser.js';

const UserRouter = express.Router();
UserRouter.get('/test',test);
UserRouter.post('/update/:id',verifyToken, updateUser);
UserRouter.delete('/delete/:id',verifyToken, deleteUser );
Router.get('/listings/:id', verifyToken, getUserListings);
Router.get('/:id', verifyToken,getUser);





export default UserRouter;