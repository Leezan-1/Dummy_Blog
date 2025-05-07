// built-in & third party modules
import express from 'express';

// controllers 
import { createNewPostCTLR, deletePostCTLR, getAllPostsCTLR, getSinglePostCTLR, updateFeatureFlagCTLR, updatePostCTLR } from '../controllers/posts.controller';

// middlewares
import { authTokenMW } from '../middlewares/authToken.middleware';
import { uploadPostImagesMW } from '../middlewares/multer.middleware';


const router = express.Router();

router.route("/").get(getAllPostsCTLR);

router.route("/new-post").post(authTokenMW, uploadPostImagesMW, createNewPostCTLR);

router.route("/:postId")
    .get(getSinglePostCTLR)
    .delete(authTokenMW, deletePostCTLR)
    .patch(authTokenMW, uploadPostImagesMW, updatePostCTLR);

router.route("/:postId/featured").patch(updateFeatureFlagCTLR);

export default router;