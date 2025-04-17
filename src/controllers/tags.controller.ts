import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";
import TagService from "../services/Tag.service";
import { apiSuccessMsg } from "../utils/apiMessage.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";

export const getAllTagsCTLR = wrapRequestFunction(async (req, res) => {

    const allTags = await TagService.getAllTags();

    // response
    const resCode = 200;
    const resMsg = apiSuccessMsg(resCode, "all tags fetched", allTags);
    res.status(resCode).json(resMsg);
});

export const createNewTagCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const newTag = req.params?.tagName.toLowerCase();

    await TagService.createTag(newTag);

    // response
    const resCode = 201;
    const resMsg = apiSuccessMsg(resCode, "new tag created successfully");
    res.status(resCode).json(resMsg);
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