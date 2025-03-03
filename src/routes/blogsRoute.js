const express = require('express');
const { getAllBlogsCTLR, getSinglePostCTLR, createUserBlogCTLR } = require('../controllers/blogsController');
const { authTokenMW } = require('../middlewares/jwtMiddleware');

const router = express.Router();

router.route('/').get(getAllBlogsCTLR);
router.route('/:post_uuid').get(getSinglePostCTLR);
router.route('/new-post').get(authTokenMW, createUserBlogCTLR)

module.exports = router;