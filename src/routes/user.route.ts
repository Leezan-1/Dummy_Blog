import express from 'express';

import { authTokenMW } from '../middlewares/authToken.middleware';
import { getUserPosts } from '../controllers/user.controller';

const router = express.Router();

router.route("/:uname/posts").get(authTokenMW, getUserPosts);

export default router;