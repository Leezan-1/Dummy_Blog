import express from 'express';

import { authTokenMW } from '../middlewares/authToken.middleware';
import { getUserPostsCTLR } from '../controllers/user.controller';

const router = express.Router();

router.route("/:uname/posts").get(authTokenMW, getUserPostsCTLR);

export default router;