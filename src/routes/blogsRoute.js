const express = require('express');
const { authTokenMW } = require('../middlewares/jwtMiddleware');
const { validatePostMW } = require('../middlewares/validationMiddleware');
const { uploadBlogImagesMW } = require('../middlewares/multerMiddleware')
const {
    getAllPostsCTLR,
    getSinglePostCTLR,
    createNewPostCTLR,
    deletePostCTLR,
    updatePostCTLR,
    uploadImageCTLR
} = require('../controllers/blogsController');


//Router config that handles routing.
const router = express.Router();

router.route('/').get(getAllPostsCTLR);

// router.route('/:post_slug').get(getSinglePostCTLR);
// router.route('/uploads').post(uploadBlogImagesMW, uploadImageCTLR);

router.route('/new-post').post(authTokenMW, uploadBlogImagesMW, validatePostMW, createNewPostCTLR)

router.route('/:post_id')
    .get(getSinglePostCTLR)
    // .all(authTokenMW)
    //VALIDATE:add validation controller that validates post_id to be integer
    .delete(authTokenMW, deletePostCTLR)
    .patch(authTokenMW, validatePostMW, updatePostCTLR);

module.exports = router;