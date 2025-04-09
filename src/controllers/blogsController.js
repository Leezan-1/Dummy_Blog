/*
This controllers CRUD for blog post.
Every Controller is wrapped with wrapController()  that handles 
error if any error is thrown.
*/
const PostInfo = require("../resources/postInfo");
const BlogService = require("../services/BlogService");
const { ApiResponse, wrapController } = require("../utils");

// controller to get all the blogs from the database
const getAllPostsCTLR = wrapController(async (req, res) => {

    // if page and limit are NaN then default is 1 and 10
    let page = Number(req.query?.page) || 1;
    let limit = Number(req.query?.limit) || 10;
    const queryOptions = {
        isFeatured: (req.query?.featured == '1') ? true : undefined,
        tags: req.query?.tags
    }
    // service that gets all posts and its info with images
    const allPosts = await BlogService.getAllBlogPosts(page, limit, queryOptions);

    const toUserResponse = PostInfo.toCollectionResponse(allPosts, page, limit);

    // All post retrieved!
    return res.status(200).json(ApiResponse.success(200, "All Blogs Data Fetched!", toUserResponse));

});

const getSinglePostCTLR = wrapController(async (req, res) => {

    let post;
    let post_id = Number(req.params?.post_id);

    // if post"s id  is a NaN then it should query as slug
    if (isNaN(post_id)) {
        let post_slug = req.params?.post_id;
        post = await BlogService.getSinglePostBySlug(post_slug);
    }
    else {
        post = await BlogService.getSinglePostByID(post_id);
    }

    await BlogService.updateBlogViewCount(post.id);

    const responseData = ApiResponse.success(200, "Blog Data Fetched!", PostInfo.toResponse(post, req))
    res.status(200).json(responseData);
});

// controller that creates user blog entries
const createNewPostCTLR = wrapController(async (req, res) => {

    // gets user info from access token
    const userId = req.user.id;

    // user info is sent  along with form data(req.body) and with image(req.files)
    await BlogService.createBlogPost(userId, req.body, req.files);

    const responseData = ApiResponse.success(201, "Post Created");
    res.status(201).json(responseData);
});

// controller that updates user blog using post_id
const updatePostCTLR = wrapController(async (req, res) => {

    // user info from access token
    const userId = req.user.id;

    // post"s id is retrieved from params
    const postId = Number(req.params?.post_id);

    // post is returned by blog service of given post id 
    const postInfo = await BlogService.getSinglePostByID(postId);

    // post is updated 
    await BlogService.updateBlogPost(userId, postInfo, req.body, req.files);

    // response is sent as json stating user is updated.
    res.status(200).json(ApiResponse.success(200, "Post updated successfully"));
});

// controller that delete posts using post_id;
const deletePostCTLR = wrapController(async (req, res) => {

    // user info is  from access token post id from route parameter.
    const userId = req.user.id;
    const postId = Number(req.params?.post_id);

    // post info is retrieved by service
    const postInfo = await BlogService.getSinglePostByID(postId);

    //deletes blog post by service
    await BlogService.deleteBlogPost(userId, postInfo);

    // sends api response as json object with message.
    res.status(200).json(ApiResponse.success(200, "Post deleted"));

});

// update the post to be featured!
const updateFeatureFlagCTLR = wrapController(async (req, res) => {
    let postId = Number(req.params?.post_id);

    await BlogService.updateBlogFeaturedFlag(postId);

    res.json(ApiResponse.success(200, "Featured Flag updated!"))
});

module.exports = {
    getAllPostsCTLR,
    getSinglePostCTLR,
    createNewPostCTLR,
    updatePostCTLR,
    updateFeatureFlagCTLR,
    deletePostCTLR,
};