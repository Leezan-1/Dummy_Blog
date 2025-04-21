// models
import { Post } from "../models/Post";


import { Post_Images } from "../models/Post_Images";

// interfaces
import PostFrom from "../interfaces/PostForm.interface";

import { Tag } from "../models/Tag";
import TagService from "./Tag.service";

// utility function
import CustomError from "../utils/CustomError.utils";
import { generateSlug } from "../utils/generateSlug.utils";
import { validatePostExcerpt, validatePostTitle, validateTags } from "../utils/validation.utils";
import deleteImageFile from "../utils/deleteImageFile.utils";

export class PostService {

    static async getSinglePost(postIdOrSlug: number | string, userId?: number): Promise<Post> {

        if (!postIdOrSlug) {
            throw new CustomError(400, "invalid post id or slug");
        }

        const post = await Post.scope(['includeUser', "includeImages"]).findByPk(postIdOrSlug);
        if (!post)
            throw new CustomError(404, "no post found with the given id");

        return post;
    }

    static async createNewPost(userId: number, postFormData: PostFrom, postImages?: { [field: string]: Express.Multer.File[] }) {

        const { title, excerpt, tags, description } = postFormData;
        let toAddTags: Tag | Tag[] | null;

        validatePostTitle(title);
        validatePostExcerpt(excerpt);
        // VALIDATE description

        // generate slug from post title
        if (tags) {
            validateTags(tags)
            toAddTags = await TagService.checkTagsExist(tags);
            if (!toAddTags) {
                throw new CustomError(404, "given tag or tags not found");
            }
        }

        let postSlug = await generateSlug(title);

        let thumbnailImg = postImages?.["thumbnail-image"]?.[0];
        let blogImages = postImages?.["blog-images"];
        if (!thumbnailImg)
            thumbnailImg = blogImages?.[0];


        const post = await Post.create({
            title: title,
            slug: postSlug,
            excerpt: excerpt,
            description: description,
            thumbnail: thumbnailImg?.filename,
            thumbnail_path: thumbnailImg?.path,
            user_id: userId
        });

        if (blogImages) {
            let imageFiles = blogImages?.map((image) => ({
                post_id: post.id,
                img_name: image?.filename,
                path: image?.path
            }));
            await Post_Images.bulkCreate(imageFiles);
        }
        // if (toAddTags!)
        await post.$add('tags', toAddTags!);
        return post;
    }

    static async updatePost(userId: number, postInfo: Post, postFormData: PostFrom, postImages?: { [field: string]: Express.Multer.File[] }) {
        if (userId != postInfo.user_id)
            throw new CustomError(401, "invalid user trying to update post");

        let toSetTags: Tag | Tag[] | null = null;

        // validate form data
        const { title, excerpt, tags, description } = postFormData;
        validatePostTitle(title);
        validatePostExcerpt(excerpt);

        if (tags) {
            validateTags(tags)
            toSetTags = await TagService.checkTagsExist(tags);
            if (!toSetTags)
                throw new CustomError(404, "given tag or tags not found")
        }


        let thumbnailImg = postImages?.["thumbnail-image"]?.[0];
        let blogImages = postImages?.["blog-images"];
        if (!thumbnailImg && !postInfo.thumbnail_path)
            thumbnailImg = blogImages?.[0];

        // previous thumbnail image
        let prevThumbnailPath = postInfo.thumbnail_path;

        // content is updated
        const updated = await postInfo.update({
            title: title,
            excerpt: excerpt,
            thumbnail: thumbnailImg?.filename,
            thumbnail_path: thumbnailImg?.path,
            description: description,
        });

        await updated.$set('tags', toSetTags!);


        if (thumbnailImg?.path && prevThumbnailPath)
            await deleteImageFile(prevThumbnailPath);

        // 🔥 Delete all previously associated images
        if (postInfo.images?.length) {
            // console.log('postInfo.images :>> ', postInfo.images);
            for (const image of postInfo.images) {
                if (image.path === prevThumbnailPath) {
                    image.destroy();
                }

                else {
                    // or image.url or image.file_path depending on your column name
                    await deleteImageFile(image.path);
                    // remove DB record
                    await image.destroy();
                }
            }
        }

        if (blogImages) {
            let imageFiles = blogImages?.map((image) => ({
                post_id: postInfo.id,
                img_name: image.filename,
                path: image.path
            }));

            await Post_Images.bulkCreate(imageFiles);
        }

    }

    static async deletePost(userId: number, postInfo: Post, postId?: number) {

        if (userId != postInfo.user_id)
            throw new CustomError(401, "invalid user trying to delete post");

        await postInfo.destroy();
        // if deleted then delete the image file too

        if (postInfo.images.length) {
            for (const image of postInfo.images) {
                if (image.path !== postInfo.thumbnail_path)
                    deleteImageFile(image.path);
            }
        }
        if (postInfo.thumbnail_path) {
            deleteImageFile(postInfo.thumbnail_path);
        }
    }
}