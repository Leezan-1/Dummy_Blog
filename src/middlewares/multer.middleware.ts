import { uploadPostImage, uploadUserImage } from "../config/multer.config";

export const uploadPostImagesMW = uploadPostImage.fields([
    { name: "thumbnail-image", maxCount: 1 },
    { name: "blog-images", maxCount: 5 }
]);


export const uploadUserImageMW = uploadUserImage.single("user-image");