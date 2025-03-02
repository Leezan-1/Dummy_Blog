const BlogService = require("../services/blogService");
const ApiResponse = require("../utils/apiMessage");
const { wrapController } = require("../utils/asyncwrappers");

const getAllBlogsCTLR = wrapController(async (req, res) => {

    allPosts = await BlogService.getAllPosts();
    res.status(200).json(ApiResponse.success(200, null, allPosts));

});

module.exports = { getAllBlogsCTLR };