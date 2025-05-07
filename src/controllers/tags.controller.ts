// built-in & third party modules
// configs and resources
import { TagsInfo } from "../resources/TagsInfo";

// schemas, interfaces & enums
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";

// models and services
import TagService from "../services/Tag.service";

// utility functions & classes
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";
import { apiSuccessMsg } from "../utils/apiMessage.utils";


export const getAllTagsCTLR = wrapRequestFunction(async (req, res) => {

    const allTags = await TagService.getAllTags();

    // response
    const resCode = 200;
    res.status(resCode).json(apiSuccessMsg(resCode, "all tags fetched", TagsInfo.sendAllTags(allTags)));
});

export const createNewTagCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const newTag = req.params?.tagName.toLowerCase();

    await TagService.createTag(newTag);

    // response
    const resCode = 201;
    res.status(resCode).json(apiSuccessMsg(resCode, "new tag created successfully"));
});

export const updateTagCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const prevTagName = req.params?.prevTag.toLowerCase();
    const newTagName = req.params?.newTag.toLowerCase();

    await TagService.updateTag(prevTagName, newTagName);

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "tag update successfully");
    res.status(resCode).json(resMsg);
});

export const deleteTagCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const tagName = (req.params?.tagName as string).toLowerCase();

    await TagService.deleteTag(tagName);

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "tag deleted");
    res.status(resCode).json(resMsg);
});