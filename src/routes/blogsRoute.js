const express = require("express");
const { authTokenMW } = require("../middlewares/jwtMiddleware");
const { uploadBlogImagesMW } = require("../middlewares/multerMiddleware")
const {
    getAllPostsCTLR,
    getSinglePostCTLR,
    createNewPostCTLR,
    deletePostCTLR,
    updatePostCTLR,
    updateFeatureFlagCTLR,
} = require("../controllers/blogsController");


//Router config that handles routing.
const router = express.Router();

// router.use(validatePostMW);
router.route("/").get(getAllPostsCTLR);

// router.route("/:post_slug").get(getSinglePostCTLR);
// router.route("/uploads").post(uploadBlogImagesMW, uploadImageCTLR);

router.route("/new-post").post(authTokenMW, uploadBlogImagesMW, createNewPostCTLR)
router.route("/update-feature/:post_id").get(updateFeatureFlagCTLR);
router.route("/:post_id")
    .get(getSinglePostCTLR)
    // .all(authTokenMW)
    //VALIDATE:add validation controller that validates post_id to be integer
    .delete(authTokenMW, deletePostCTLR)
    .patch(authTokenMW, uploadBlogImagesMW, updatePostCTLR);

module.exports = router;