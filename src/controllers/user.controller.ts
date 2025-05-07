// built-in & third party modules
// configs and resources
import { PostInfo } from "../resources/PostInfo";

// schemas, interfaces & enums
import AuthenticatedRequest from "../interfaces/AuthenticatedRequest.interface";

// models and services
import { PostService } from "../services/Post.service";

// utility functions & classes
import { apiSuccessMsg } from "../utils/apiMessage.utils";
import wrapRequestFunction from "../utils/wrapRequestFunction.utils";


export const getUserPostsCTLR = wrapRequestFunction(async (req: AuthenticatedRequest, res) => {

    const query = {
        page: Number(req.query?.page) || 1,
        limit: Number(req.query?.limit) || 10,
        uid: req.user?.id,
        username: req.params.uname.split('@')[1]
    };

    const allPost = await PostService.getAllPost(query);

    let resCode = 200;
    res.status(resCode).json(
        apiSuccessMsg(resCode,
            "all post of user fetched successfully",
            PostInfo.toCollectionResponse(allPost.rows, allPost.count, query.page, query.limit))
    );
});