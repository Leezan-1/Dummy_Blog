/*
This controllers CRUD for blog post.
Every Controller is wrapped with wrapController()  that handles 
error if any error is thrown.
*/
const PostInfo = require("../resources/postInfo");
const BlogService = require("../services/blogService");
const { ApiResponse, wrapController, toJson } = require('../utils');

// controller to get all the blogs from the database
const getAllPostsCTLR = wrapController(async (req, res) => {

    // VALIDATE req.query 
    let page = Number(req.query?.page ?? 1);
    let limit = Number(req.query?.limit ?? 10);


    // service that gets all posts and its info with images
    const { allPosts, paginationData } = await BlogService.getAllPosts(page, limit);

    const toUserResponse = {
        metadata: paginationData,
        posts: allPosts.map((posts) => PostInfo.toCollectionResponse(posts)),
    }
    // All post retrieved!
    return res.status(200).json(ApiResponse.success(200, 'All Blogs Data Fetched!', toUserResponse));

});

const getSinglePostCTLR = wrapController(async (req, res) => {

    let post;
    // let post_slug = req.params?.post_slug;
    // //VALIDATE post's slug as slug.

    let post_id = req.params?.post_id;
    //VALIDATE post's id as integer

    // if (post_slug) {
    //     post = await BlogService.getSinglePost(post_slug);
    // };
    if (post_id) {
        post = await BlogService.getSinglePostByID(post_id);
    }

    await BlogService.updateBlogViewCount(post.id);
    res.status(200).json(ApiResponse.success(200, 'Blog Data Fetched!', PostInfo.toResponse(post)));
});

// controller that creates user blog entries
const createNewPostCTLR = wrapController(async (req, res) => {

    // gets user info from access token
    const user = req.user;

    // user info is sent  along with form data(req.body) and with image(req.files)
    await BlogService.createBlogPost(user, req.body, req.files);

    res.status(201).json(ApiResponse.success(201, 'Post Created'));
});

// controller that updates user blog using post_id
const updatePostCTLR = wrapController(async (req, res) => {

    // user info from access token
    const user = req.user;

    // post's id is retrieved from params
    const postId = req.params.post_id;

    // post is returned by blog service of given post id
    const postInfo = await BlogService.getSinglePostByID(postId);

    // post is updated 
    await BlogService.updateBlogPost(user, postInfo, req.body, req.files);

    // response is sent as json stating user is updated.
    res.status(200).json(ApiResponse.success(200, 'Post updated successfully'));
});

// controller that delete posts using post_id;
const deletePostCTLR = wrapController(async (req, res) => {

    // user info is  from access token post id from route parameter.
    const user = req.user;
    const postId = req.params?.post_id;
    // VALIDATE post's id to be post

    // post info is retrieved by service
    const postInfo = await BlogService.getSinglePostByID(postId);

    //deletes blog post by service
    await BlogService.deleteBlogPost(user, postInfo);

    // sends api response as json object with message.
    res.status(200).json(ApiResponse.success(200, 'Post deleted'));

});


module.exports = {
    getAllPostsCTLR,
    getSinglePostCTLR,
    createNewPostCTLR,
    updatePostCTLR,
    deletePostCTLR,
};