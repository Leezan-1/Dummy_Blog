const BlogService = require("../services/blogService");
const ApiResponse = require("../utils/apiMessage");
const { wrapController } = require("../utils/asyncwrappers");

const getAllBlogsCTLR = wrapController(async (req, res) => {

    // controller to get all the blogs from the database

    allPosts = await BlogService.getAllPosts();
    res.status(200).json(ApiResponse.success(200, null, allPosts));

});

const createUserBlogCTLR = wrapController(async (req, res) => {

    // controller that creates user blog entries
    const user = req.user;

});

const getSinglePostCTLR = wrapController(async (req, res) => {

    let post_uuid = req.params['post_uuid'];

    let post = await BlogService.getSinglePost(post_uuid);

    console.log('post :>> ', post);

})

module.exports = { getAllBlogsCTLR, createUserBlogCTLR, getSinglePostCTLR };