const TagService = require("../services/tagService");
const TagInfo = require('../resources/tagsInfo');
const ApiResponse = require("../utils/apiMessage");
const { wrapController } = require("../utils/asyncwrappers");
const { validateTagName } = require("../utils/validations");

const getAllTagsCTLR = wrapController(async (req, res) => {
    const tags = await TagService.getAllTags();

    const toResponse = tags.map((tag) => TagInfo.toClient(tag));
    res.status(200).json(ApiResponse.success(200, null, toResponse));

});

const createNewTagCTLR = wrapController(async (req, res) => {
    const tagName = req.body['tag-name'];

    // service that creates new tag.
    validateTagName(tagName);
    await TagService.createNewTag(tagName);

    res.status(201).json(ApiResponse.success(201, "Tag created succesfully"));
});

const updateTagCTLR = wrapController(async (req, res) => {
    const prevTagName = req.params['tag'];
    const newTagName = req.body['tag-name'];

    validateTagName(prevTagName);
    validateTagName(newTagName);

    await TagService.updateTag(prevTagName, newTagName);

    res.status(200).json(ApiResponse.success(201, "Tag updated successfully"))
});

const deleteTagCTLR = wrapController(async (req, res) => {
    const tagName = req.params['tag'];
    validateTagName(tagName);

    await TagService.deleteTag(tagName);

    res.status(200).json(ApiResponse.success(200, 'Tag deleted succesffully'));
});

module.exports = {
    getAllTagsCTLR,
    createNewTagCTLR,
    updateTagCTLR,
    deleteTagCTLR
};