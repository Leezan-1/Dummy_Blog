const express = require('express');
const { getAllPostsCTLR, getSinglePostCTLR, createNewPostCTLR, deletePostCTLR, updatePostCTLR } = require('../controllers/blogsController');
const { authTokenMW } = require('../middlewares/jwtMiddleware');
const { validatePostMW } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.route('/').get(getAllPostsCTLR);

// router.route('/:post_slug').get(getSinglePostCTLR);

router.route('/new-post').post(authTokenMW, validatePostMW, createNewPostCTLR)

router.route('/:post_id')
    .get(getSinglePostCTLR)
    .all(authTokenMW)
    //VALIDATE:add validation controller that validates post_id to be integer
    .delete(deletePostCTLR)
    .patch(validatePostMW, updatePostCTLR);

module.exports = router;