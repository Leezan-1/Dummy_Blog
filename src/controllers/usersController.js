const PostInfo = require("../resources/postInfo");
const BlogService = require("../services/BlogService");
const { wrapController, CustomError, ApiResponse } = require("../utils");

const getUserPosts = wrapController(async (req, res) => {

    // get user form access token
    const user = req.user;
    // get username from route parameter
    const username = req.params?.username;

    // if page and limit are given
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    // username should start with @ and 
    if (!username.startsWith("@") || user.username !== username.split("@")[1])
        throw new CustomError("Unauthorized user accessing the route", 401);

    const { posts, paginationData } = await BlogService.getAllPostsByUser(user.id, username, page, limit);

    // response
    const responseData = PostInfo.toCollectionResponse(posts, paginationData);
    let responseJson = ApiResponse.success(200, "User's posts fetched!", responseData);
    res.status(200).json(responseJson);

});

module.exports = { getUserPosts };