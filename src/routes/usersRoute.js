const express = require('express');
const router = express.Router();

const { authTokenMW } = require('../middlewares/jwtMiddleware');
const { getUserPosts } = require('../controllers/usersController');

router.use(authTokenMW);

router.route("/:username/blogs").get(getUserPosts);

module.exports = router;