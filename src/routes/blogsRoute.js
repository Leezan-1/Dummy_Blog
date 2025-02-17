const express = require('express');
const { getAllBlogs } = require('../controllers/blogsController');

const router = express.Router();

router.route('/').get(getAllBlogs);

module.exports = router;