// built-in & third party modules
import express from 'express';

// controllers 
import { getUserPostsCTLR } from '../controllers/user.controller';
// middlewares
import { authTokenMW } from '../middlewares/authToken.middleware';


const router = express.Router();

router.route("/:uname/posts").get(authTokenMW, getUserPostsCTLR);

export default router;