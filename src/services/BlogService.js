const fs = require('fs');
const { generateSlug, CustomError, pagination } = require('../utils');
const { validatePostTitle, validatePostExcerpt } = require('../utils/validations');

const { Posts, Posts_Images, Tags, Users } = require('../models').sequelize.models;



async function checkTags(tags) {
    let tagsArray = tags
    if (!Array.isArray(tags)) {
        tagsArray = Array.prototype.concat(tags);
    }
    console.log('tagsArray :>> ', tagsArray);
    const tagInstance = await Promise.all(tagsArray.map((tagName) => Tags.findOrCreate({ where: { name: tagName.trim() } })));
    return tagInstance.map(([item]) => item);
}

async function deleteImageFile(imagePath) {
    await fs.promises.unlink(imagePath)
        .catch((err) => { console.error(`Failed to delete image file ${imagePath}`, err) });
}

class BlogService {

    // gets all posts joining images and tags
    static async getAllPosts(page, limit) {

        // pagination logic

        let totalPosts = await Posts.count();
        const paginationData = pagination(totalPosts, page, limit);
        // offset is calculated later because we have to send data to 
        let offset = Math.floor((paginationData.currentPage - 1) * limit);


        const allPosts = await Posts.findAll({
            // attributes: ['id', 'uuid', 'title', 'slug', 'view_count', 'createdAt', 'visible', 'featured'],
            include: [
                {
                    model: Users,
                    as: 'author',
                    required: true,
                    attributes: ['first_name', 'last_name', 'username'],
                    right: true,
                },
                {
                    model: Tags,
                    as: 'tags',
                }
            ],
            offset: offset,
            limit: limit,
            order: ['uuid'],
        });

        if (![allPosts])
            throw new CustomError('No post found', 404);


        return { allPosts, paginationData };
    }

    // get all posts by users_id.
    static async getAllPostsByUser(userId, page, limit) {

        let totalPosts = await Posts.count({ where: { users_id: userId } });
        const paginationData = pagination(totalPosts, page, limit);
        // offset is calculated later because we have to send data to 
        let offset = Math.floor((paginationData.currentPage - 1) * limit);

        const posts = await Posts.findAll(
            {
                // attributes: ['id', 'uuid', 'title', 'slug', 'view_count', 'createdAt', 'visible', 'featured'],

                where: { users_id: userId },

                // joins images and tags tables
                include: [
                    {
                        model: Users,
                        as: 'author',
                        required: true,
                        attributes: ['first_name', 'last_name', 'username'],
                        right: true,
                    },
                    {
                        model: Posts_Images,
                        as: 'images',
                    },
                    {
                        model: Tags,
                        as: "tags",
                        // required: true,
                    }
                ],
                offset: offset,
                order: ['uuid'],
            }
        );

        return { posts, paginationData };
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
                        as: 'author',
                        required: true,
                        attributes: ['first_name', 'last_name', 'username'],
                        right: true,
                    },
                    {
                        model: Posts_Images,
                        as: 'images',
                    },
                    {
                        model: Tags,
                        as: "tags",
                        // required: true,
                    }
                ],
                order: ['uuid'],
            }
        );
        if (!post)
            throw new CustomError('Post not found', 404);
        return post;
    }

    // fetches post by its id.
    static async getSinglePostByID(postId) {

        if (isNaN(postId)) {
            throw new CustomError('Post Not Found', 404)
        }
        // post_id searches for post
        const post = await Posts.findByPk(postId,
            {
                // joins images and tags tables
                include: [
                    {
                        model: Users,
                        as: 'author',
                        required: true,
                        attributes: ['first_name', 'last_name'],
                        right: true,
                    },
                    {
                        model: Posts_Images,
                        as: 'images',
                    },
                    {
                        model: Tags,
                        as: "tags",
                        // required: true,
                    }
                ],
                order: ['uuid'],
            }
        );

        if (!post)
            throw new CustomError('Post not found', 404);

        return post;

    }

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

        // creates the post first.
        const post = await Posts.create({
            title: title,
            slug: postSlug,
            excerpt: excerpt,
            description: description,
            users_id: userId
        });

        // adds tags for the post if tags is sent with it
        if (tags) {
            const toAddTags = await checkTags(tags);
            // adds tags to the post associated with tags.
            await post.addTags(toAddTags);
        }

        // add images to post_images table
        let imageFiles = postImages.map((image) => ({
            posts_id: post.id,
            img_name: image.filename,
            path: image.path
        }));
        await Posts_Images.bulkCreate(imageFiles);

    }

    // service that deletes the post by its id.
    static async deleteBlogPost(userId, postInfo) {

        if (userId != postInfo.users_id)
            throw new CustomError('Invalid user trying to delete post', 401);

        let deleted = await postInfo.destroy();
        // let deleted = await Posts.destroy({ where: { id: postInfo.id } });
        if (deleted)
            postInfo.images.map((image) => deleteImageFile(image.path));
        else
            throw new CustomError('Could not delete post', 400);

        return (deleted) ? true : false;
    }

    static async updateBlogPost(userId, postInfo, updatePostInfo, images) {
        // Error if user is not the author of the post.
        if (userId != postInfo.users_id)
            throw new CustomError('Invalid user trying to update post', 401);

        const { title, excerpt, tags, description } = updatePostInfo;

        validatePostTitle(title);
        validatePostExcerpt(excerpt);
        // VALIDATE tags


        // check updated fields
        const updatedFields = {
            title: title,
            excerpt: excerpt,
            description: description,
        };

        // update the fields of the post
        const updated = await postInfo.update(updatedFields);

        if (!updated) {
            throw new CustomError('Could not update post', 400);
        }

        // update tags are given then add tags too.
        if (tags) {
            const toAddTags = await checkTags(tags);
            await postInfo.setTags(toAddTags);
        }

        // previous img exist then delete from db and server!
        await Posts_Images.destroy({ where: { posts_id: postInfo.id } });

        await Promise.all(postInfo.images.map((image) => deleteImageFile(image.path)));

        // prepares image file to create
        let imageFiles = images.map((image) => ({
            posts_id: postInfo.id,
            img_name: image.filename,
            path: image.path
        }));
        // add file path to db 
        await Posts_Images.bulkCreate(imageFiles);
    }

    static async updateBlogViewCount(postInfoId) {
        let updatedPost = await Posts.increment({ view_count: 1 }, { where: { id: postInfoId } });

        // if updated is not 1, then it is an error
        if (![updatedPost])
            throw new CustomError('Could not updated user data!', 400);

    }
}

module.exports = BlogService;