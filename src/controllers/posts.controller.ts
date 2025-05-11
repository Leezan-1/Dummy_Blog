// configs and resources
import { PostInfo } from "../resources/PostInfo";

// schemas, interfaces & enums
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";
import { ImageFile, QueryOpt } from "../interfaces/QueryOptions.interface";

// models and services
import { PostService } from "../services/Post.service";

// utility functions & classes
import { apiSuccessMsg } from "../utils/apiMessage.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";


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
            filename: file.filename,
            mimetype: file.mimetype,
            path: file.path
        } as ImageFile));

    const thumbnailImg = (req.files as { [field: string]: Express.Multer.File[] })
        ?.["thumbnailImage"]
        ?.map((file) => ({
            orgName: file.originalname,
            filename: file.filename,
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

    const blogImages = (req.files as { [field: string]: Express.Multer.File[] })
        ?.['blog-images']
        ?.map((file) => ({
            orgName: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            path: file.path
        } as ImageFile));

    const thmbFile = (req.files as { [field: string]: Express.Multer.File[] })?.["thumbnailImage"]?.[0];
    let thumbnailImg: ImageFile | null = null;
    if (thmbFile) {
        thumbnailImg = {
            orgName: thmbFile.originalname,
            filename: thmbFile.filename,
            mimetype: thmbFile.mimetype,
            path: thmbFile.path
        } as ImageFile;
    }

    const postInfo = await PostService.getSinglePost(postId);
    PostService.updatePost(userId, postInfo, req.body, thumbnailImg, blogImages);

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
    PostService.deletePost(userId, postInfo)

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "post deleted successfully");
    res.status(resCode).json(resMsg);
});

// updates post's featured flag
export const updateFeatureFlagCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {
    const postId = Number(req.params?.postId!);

    const postInfo = await PostService.getSinglePost(postId, false);
    await PostService.updateFeatureFlag(postInfo);

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "featured flag of post updated successfully");
    res.status(resCode).json(resMsg);

});