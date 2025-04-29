// interfaces
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";
import { PostInfo } from "../resources/PostInfo";
import { PostService } from "../services/Post.service";
import { apiSuccessMsg } from "../utils/apiMessage.utils";

// utility functions
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";
import { ImageFile, QueryOpt } from "../interfaces/QueryOptions.interface";

// controller implemented

// gets all posts with query may be
export const getAllPostsCTLR = wrapRequestFunction(async (req, res) => {

    let query: QueryOpt = {
        page: Number(req.query?.page) || 1,
        limit: Number(req.query?.limit) || 10,
        isFeatured: (req.query?.featured == '1') ? true : false,
        tags: req.query?.tags as string | string[]
    }

    const allPosts = await PostService.getAllPost(query);


    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "all posts fetched successfully", PostInfo.toCollectionResponse(allPosts.rows, allPosts.count, query.page!, query.limit!));
    res.status(resCode).json(resMsg);
});

// gets all posts with query may be
export const getSinglePostCTLR = wrapRequestFunction(async (req, res) => {

    const postId = Number(req.params?.postId);

    const singlePost = await PostService.getSinglePost(postId);
    singlePost.increment('view_count');

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "post fetched successfully", PostInfo.toResponse(singlePost));
    res.status(resCode).json(resMsg);
});

// gets all posts with query may be
export const createNewPostCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const userId = req.user?.id!;
    const blogImages = (req.files as { [field: string]: Express.Multer.File[] })
        ?.['blog-images']
        ?.map((file) => ({
            orgName: file.originalname,
            name: file.filename,
            mimetype: file.mimetype,
            path: file.path
        } as ImageFile));

    const thumbnailImg = (req.files as { [field: string]: Express.Multer.File[] })
        ?.["thumbnailImage"]
        ?.map((file) => ({
            orgName: file.originalname,
            name: file.filename,
            mimetype: file.mimetype,
            path: file.path
        } as ImageFile));

    const newPost = await PostService.createNewPost(userId, req.body, thumbnailImg, blogImages);

    // response
    const resCode = 201;
    const resMsg = apiSuccessMsg(resCode, "new posts created successfully");
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

    const postInfo = await PostService.getSinglePost(postId, false);
    await PostService.deletePost(userId, postInfo)

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "post deleted successfully");
    res.status(resCode).json(resMsg);
});

export const updateFeatureFlagCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {
    const postId = Number(req.params?.postId!);

    const postInfo = await PostService.getSinglePost(postId, false);
    await PostService.updateFeatureFlag(postInfo);

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "featured flag of post updated successfully");
    res.status(resCode).json(resMsg);

});