// interfaces
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";
import { PostService } from "../services/Post.service";
import { apiSuccessMsg } from "../utils/apiMessage.utils";

// utility functions
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";

// controller implemented

// gets all posts with query may be
export const getAllPostsCTLR = wrapRequestFunction(async (req, res) => {



    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "all posts fetched successfully");
    res.status(resCode).json(resMsg);
});

// gets all posts with query may be
export const getSinglePostCTLR = wrapRequestFunction(async (req, res) => {

    const postId = Number(req.params?.postId);

    const singlePost = await PostService.getSinglePost(postId);
    singlePost.increment('view_count');

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "post fetched successfully", singlePost);
    res.status(resCode).json(resMsg);
});

// gets all posts with query may be
export const createNewPostCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const userId = req.user?.id!;

    const newPost = await PostService.createNewPost(userId, req.body, req.files as { [field: string]: Express.Multer.File[] });

    // response
    const resCode = 201;
    const resMsg = apiSuccessMsg(resCode, "new posts created successfully", newPost);
    res.status(resCode).json(resMsg);
});

// gets all posts with query may be
export const updatePostCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const userId = req.user?.id!;

    const postId = Number(req.params?.postId!);

    const postInfo = await PostService.getSinglePost(postId);

    await PostService.updatePost(userId, postInfo, req.body, req.files as { [field: string]: Express.Multer.File[] });

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "post updated successfully");
    res.status(resCode).json(resMsg);
});

// gets all posts with query may be
export const deletePostCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const userId = req.user?.id!;
    const postId = Number(req.params?.postId!);

    const postInfo = await PostService.getSinglePost(postId);
    await PostService.deletePost(userId, postInfo)

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "post deleted successfully");
    res.status(resCode).json(resMsg);
});
