const { generateSlug, CustomError, pagination } = require("../utils");
const { validatePostTitle, validatePostExcerpt, validateTags } = require("../utils/validations");
const deleteFile = require("../utils/deleteFile");

const { Posts, Posts_Images, Tags, Users } = require("../models");
const { Op } = require("sequelize");

async function checkTags(tags) {
    let tagsArray = tags
    if (!Array.isArray(tags)) {
        tagsArray = Array.prototype.concat(tags);
    }
    const tagInstance = await Promise.all(tagsArray.map((tagName) => Tags.findOrCreate({ where: { name: tagName?.toLowerCase()?.trim() } })));
    return tagInstance.map(([item]) => item);
}

function getWhereCondition(queryOptions) {
    const conditions = {};

    if (queryOptions?.userId) {
        conditions[Op.and] = {
            users_id: queryOptions?.userId,
            ["$author.username$"]: queryOptions?.username,
        }
    }
    if (queryOptions?.isFeatured) {
        conditions.featured = true;
    }

    return conditions;
}

class BlogService {

    // gets all posts joining images and tags
    static async getAllBlogPosts(page, limit, queryOptions) {

        // Build where clause
        const whereConditions = getWhereCondition(queryOptions);

        // if (queryOptions?.tags)
        const tagsArray = validateTags(queryOptions?.tags);

        // const includeTags = getIncludeTags(queryOptions?.tags);
        const allPosts = await Posts.findAndCountAll({
            // remember this returns count (total posts) and rows(post obj in array)
            // this counts duplicate data while using join, so distinct should be true.
            include: [
                {
                    model: Users,
                    as: "author",
                    required: true,
                    right: true,
                    attributes: ["first_name", "last_name", "username"],
                },
                {
                    model: Tags,
                    as: "tags",
                    through: { attributes: [] },
                    attributes: ["name"],
                    where: tagsArray.length > 0 ? { name: { [Op.in]: tagsArray } } : null,
                }
            ],
            where: whereConditions,
            offset: Math.floor((page - 1)) * limit,
            limit: limit,
            order: ["uuid"],
            distinct: true,
        });

        return allPosts;
    }

    // get single post of a user using slug field of post
    static async getSinglePostBySlug(postSlug) {

        const post = await Posts.findOne(
            {
                where: { slug: postSlug },
                // joins images and tags tables
                include: [
                    {
                        model: Users,
                        as: "author",
                        required: true,
                        attributes: ["first_name", "last_name", "username"],
                        right: true,
                    },
                    {
                        model: Posts_Images,
                        as: "images",
                    },
                    {
                        model: Tags,
                        as: "tags",
                        // required: true,
                    }
                ],
                order: ["uuid"],
            }
        );
        if (!post)
            throw new CustomError("Post not found", 404);
        return post;
    }

    // fetches post by its id.
    static async getSinglePostByID(postId) {

        if (isNaN(postId)) {
            throw new CustomError("Post Not Found", 404)
        }
        // post_id searches for post
        const post = await Posts.findByPk(postId,
            {
                // joins images and tags tables
                include: [
                    {
                        model: Users,
                        as: "author",
                        required: true,
                        attributes: ["first_name", "last_name", "username"],
                        right: true,
                    },
                    {
                        model: Posts_Images,
                        as: "images",
                    },
                    {
                        model: Tags,
                        as: "tags",
                        // required: true,
                    }
                ],
                order: ["createdAt", "uuid"],
            }
        );

        if (!post)
            throw new CustomError("Post not found", 404);

        return post;

    }
z``
    // service that creates new blog post
    static async createBlogPost(userId, formPostInfo, postImages) {
    const { title, excerpt, tags, description } = formPostInfo;

    // validates post form body

    validatePostTitle(title);
    validatePostExcerpt(excerpt);
    // VALIDATE tags and description.
    // convert tags into array while validating

    // generates slug for the post
    let postSlug = await generateSlug(title);

    let thumbnail_img = postImages["thumbnail-image"]?.[0];
    let blog_images = postImages["blog-images"];

    if (!thumbnail_img) {
        thumbnail_img = blog_images?.[0];
    }

    // creates the post first.
    const post = await Posts.create({
        title: title,
        slug: postSlug,
        excerpt: excerpt,
        description: description,
        thumbnail: thumbnail_img?.filename,
        thumbnail_path: thumbnail_img?.path,
        users_id: userId
    });

    // adds tags for the post if tags is sent with it
    if (tags) {
        const toAddTags = await checkTags(tags);
        // adds tags to the post associated with tags.
        await post.addTags(toAddTags);
    }

    if (blog_images) {
        // add images to post_images table
        let imageFiles = blog_images?.map((image) => ({
            posts_id: post.id,
            img_name: image.filename,
            path: image.path
        }));
        await Posts_Images.bulkCreate(imageFiles);
    }

}

    // service that deletes the post by its id.
    static async deleteBlogPost(userId, postInfo) {

    if (userId != postInfo.users_id)
        throw new CustomError("Invalid user trying to delete post", 401);

    let deleted = await postInfo.destroy();
    // let deleted = await Posts.destroy({ where: { id: postInfo.id } });
    if (deleted)
        postInfo.images.map((image) => deleteFile(image.path));
    else
        throw new CustomError("Could not delete post", 400);

    return (deleted) ? true : false;
}

    static async updateBlogPost(userId, postInfo, updatePostInfo, images) {

    // Error if user is not the author of the post.
    if (userId != postInfo.users_id)
        throw new CustomError("Invalid user trying to update post", 401);

    // validate form data
    const { title, excerpt, tags, description } = updatePostInfo;
    validatePostTitle(title);
    validatePostExcerpt(excerpt);
    // VALIDATE tags and description
    // tags should be lowercase and be in array

    // If thumbnail is not given, then first image of blog_image is the thumbnail!
    let thumbnail_img = images["thumbnail-image"]?.[0];
    let blog_images = images["blog-images"];

    if (!thumbnail_img) {
        thumbnail_img = blog_images?.[0];
    }

    // update the fields of the post along with thumbnail
    let previousThumbnailPath = postInfo.thumbnail_path;
    const updated = await postInfo.update({
        title: title,
        excerpt: excerpt,
        description: description,
        thumbnail: thumbnail_img?.filename,
        thumbnail_path: thumbnail_img?.path
    });
    if (!updated) {
        throw new CustomError("Could not update post", 400);
    }

    // remove previous image file from server
    if (previousThumbnailPath)
        await deleteFile(previousThumbnailPath);


    if (postInfo.images !== null && postInfo.images.length > 0) {
        // console.log("postInfo.images :>> ", postInfo.images);
        await Posts_Images.destroy({ where: { posts_id: postInfo.id } });
        await Promise.all(postInfo.images.map((image) => deleteFile(image.path)));
    }

    // new images is given add it to the database and server.
    if (blog_images) {

        // prepares image file to create
        let imageFiles = blog_images?.map((image) => ({
            posts_id: postInfo.id,
            img_name: image.filename,
            path: image.path
        }));
        // add file path to db 
        await Posts_Images.bulkCreate(imageFiles);
    }

    // update tags are given then add tags too.
    if (tags) {
        toAddTags = await checkTags(tags);
        await postInfo.setTags(toAddTags);
    }
    else {
        await postInfo.removeTags();
    }
    // // }


}

    static async updateBlogViewCount(postId) {
    if (isNaN(postId))
        throw new CustomError("Post Not Found!", 404);

    let updatedPost = await Posts.increment({ view_count: 1 }, { where: { id: postId } });

    // if updated is not 1, then it is an error
    if (![updatedPost])
        throw new CustomError("Could not updated view count of the post!", 400);

}

    static async updateBlogFeaturedFlag(postId) {
    if (isNaN(postId))
        throw new CustomError("Post Not Found!", 404);

    let updatedFlag = Posts.update({ featured: true }, { where: { id: postId } })
    if (![updatedFlag])
        throw new CustomError("Could not update featured flag of the post!", 400)
}
}

module.exports = BlogService;