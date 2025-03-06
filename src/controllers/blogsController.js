const BlogService = require("../services/blogService");
const ApiResponse = require("../utils/apiMessage");
const { wrapController } = require("../utils/asyncwrappers");

// controller to get all the blogs from the database
const getAllPostsCTLR = wrapController(async (req, res) => {

    const allPosts = await BlogService.getAllPosts();
    res.status(200).json(ApiResponse.success(200, null, allPosts));

});

const getSinglePostCTLR = wrapController(async (req, res) => {


    // let post_slug = req.params?.post_slug;
    // //VALIDATE post's slug as slug.

    let post_id = req.params?.post_id;
    //VALIDATE post's id as integer

    let post;

    // if (post_slug) {
    //     post = await BlogService.getSinglePost(post_slug);
    // };

    if (post_id) {
        post = await BlogService.getSinglePostByID(post_id);
    }

    res.status(200).json(ApiResponse.success(200, null, post));
});

// controller that creates user blog entries
const createNewPostCTLR = wrapController(async (req, res) => {

    const user = req.user;

    await BlogService.createBlogPost(user, req.body, req.files);

    res.status(201).json(ApiResponse.success(201, 'Post Created'));
});

// controller that updates user blog using post_id
const updatePostCTLR = wrapController(async (req, res) => {

    const user = req.user;
    const postId = req.params?.post_id;

    const postInfo = await BlogService.getSinglePostByID(postId);

    await BlogService.updateBlogPost(user, postInfo, req.body, req.file);

    res.status(200).json(ApiResponse.success(200, 'User updated successfully'));
});

// controller that delete posts using post_id;
const deletePostCTLR = wrapController(async (req, res) => {

    const user = req.user;
    const postId = req.params?.post_id;
    // VALIDATE post's id to be post

    const postInfo = await BlogService.getSinglePostByID(postId);

    await BlogService.deleteBlogPost(user, postInfo);
    res.status(200).json(ApiResponse.success(200, 'User deleted'));

});

const uploadImageCTLR = wrapController(async (req, res) => {
    console.log('req.body', req.body);
    console.log('req.files :>> ', req.files);


    res.status(200).json(ApiResponse.success(200));
});

module.exports = {
    getAllPostsCTLR,
    getSinglePostCTLR,
    createNewPostCTLR,
    updatePostCTLR,
    deletePostCTLR,
    uploadImageCTLR
};