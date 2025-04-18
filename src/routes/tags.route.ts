import express from "express";
import { createNewTagCTLR, deleteTagCTLR, getAllTagsCTLR, updateTagCTLR } from "../controllers/tags.controller";
import { authTokenMW } from "../middlewares/authToken.middleware";

const router = express.Router();

router.route("/").get(getAllTagsCTLR);

// ROLE check these routes with middleware if RBAC is used
router.route("/:tagName").all(authTokenMW)
    // tagName here is new tag name
    .post(createNewTagCTLR)
    .delete(deleteTagCTLR)

router.route("/:prevTag/:newTag")
    .patch(authTokenMW, updateTagCTLR);

export default router;