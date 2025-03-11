const express = require('express');
const router = express.Router();

router.route('/').get();
router.route('/create-tag').post();
router.route('/:tag').patch()
module.exports = router;