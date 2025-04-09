const PostInfo = require("../resources/postInfo");
const BlogService = require("../services/BlogService");
const { wrapController, ApiResponse } = require("../utils");

const getUserPosts = wrapController(async (req, res) => {

    // if page and limit are given
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    const queryOptions = {
        // get user form access token
        userId: req?.user.id,
        // get username from route parameter
        username: req.params?.username.split('@')[1]
    };


    const allPosts = await BlogService.getAllBlogPosts(page, limit, queryOptions);

    // response
    let responseCode = 200;
    const responseData = PostInfo.toCollectionResponse(allPosts, page, limit);
    const responseJson = ApiResponse.success(responseCode, "User's posts fetched!", responseData);
    res.status(responseCode).json(responseJson);

});

module.exports = { getUserPosts };