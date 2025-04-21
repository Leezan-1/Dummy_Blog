import express from 'express';
import { createNewPostCTLR, deletePostCTLR, getAllPostsCTLR, getSinglePostCTLR, updatePostCTLR } from '../controllers/posts.controller';
import { authTokenMW } from '../middlewares/authToken.middleware';
import { uploadPostImagesMW } from '../middlewares/multer.middleware';

const router = express.Router();

router.route("/").get(getAllPostsCTLR);

router.route("/new-post").post(authTokenMW, uploadPostImagesMW, createNewPostCTLR);

router.route("/update-featured/:postId");

router.route("/:postId")
    .get(getSinglePostCTLR)
    .delete(authTokenMW, deletePostCTLR)
    .patch(authTokenMW, uploadPostImagesMW, updatePostCTLR);

export default router;