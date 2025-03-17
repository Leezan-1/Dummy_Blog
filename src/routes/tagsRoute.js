const express = require('express');
const router = express.Router();
const {
    getAllTagsCTLR,
    createNewTagCTLR,
    updateTagCTLR,
    deleteTagCTLR
} = require('../controllers/tagsController');

// only admins can get create,update or delete tags
router.route('/').get(getAllTagsCTLR);

router.route('/create-tag').post(createNewTagCTLR);

router.route('/:tag')
    .patch(updateTagCTLR)
    .delete(deleteTagCTLR)

module.exports = router;