const PostInfo = require("../resources/postInfo");
const { toCollectionResponse } = require("../resources/postInfo");
const BlogService = require("../services/blogService");
const { wrapController, CustomError, ApiResponse } = require("../utils");

const getUserPosts = wrapController(async (req, res) => {

    const user = req.user;
    const username = req.params?.username;
    const page = Number(req.query?.page) || 1;
    const limit = Number(req.query?.limit) || 10;

    if (user.username !== username)
        throw new CustomError('Unauthorized user accessing ', 401);

    const { posts, paginationData } = await BlogService.getAllPostsByUser(user.id, page, limit);

    console.log('paginationData :>> ', paginationData);
    // response
    const responseData = PostInfo.toCollectionResponse(posts, paginationData);
    let responseJson = ApiResponse.success(200, 'User\'s posts fetched!', responseData);
    res.status(200).json(responseJson);

});

module.exports = { getUserPosts };