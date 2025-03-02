const express = require('express');
const { getAllBlogsCTLR } = require('../controllers/blogsController');

const router = express.Router();

router.route('/').get(getAllBlogsCTLR);

module.exports = router;