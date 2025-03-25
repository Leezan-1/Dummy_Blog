const fs = require('fs');
const { Op } = require('sequelize');
const { toJson, generateSlug, CustomError, pagination } = require('../utils');

const { Posts, Posts_Images, Posts_Tags, Tags, Users } = require('../models').sequelize.models;



async function checkTags(tagArray) {
    const tagInstance = await Promise.all(tagArray.map((tagName) => Tags.findOrCreate({ where: { name: tagName.trim() } })));
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

        let totalPost = await Posts.count();
        const paginationData = pagination(totalPost, page, limit);
        // offset is calculated later because we have to send data to 
        let offset = Math.floor((paginationData.currentPage - 1) * limit);

        const allPosts = await Posts.findAll({
            attributes: ['id', 'uuid', 'title', 'slug', 'view_count', 'createdAt', 'visible', 'featured'],
            include: [
                {
                    model: Users,
                    as: 'author',
                    required: true,
                    attributes: ['first_name', 'last_name'],
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
    static async getPostsByUser(uId) {

    }

    // get single post of a user using slug field of post
    static async getSinglePost(postSlug) {

        const post = await Posts.findOne({ where: { slug: postSlug } });
        if (!post)
            throw new CustomError('Post not found', 404);
        return toJson(post);
    }

    // fetches post by its id.
    static async getSinglePostByID(post_id) {

        // post_id searches for post
        const post = await Posts.findByPk(post_id,
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
    static async createBlogPost(userInfo, formPostInfo, postImages) {

        // generates slug
        formPostInfo.slug = await generateSlug(formPostInfo.title);
        const toAddTags = await checkTags(formPostInfo?.tags);

        const post = await Posts.create({
            title: formPostInfo.title,
            slug: formPostInfo.slug,
            excerpt: formPostInfo.excerpt,
            description: formPostInfo?.description,
            users_id: userInfo?.id
        });

        // adds tags to the post associated with tags.
        await post.addTags(toAddTags);

        // add images to post_images table
        let imageFiles = postImages.map((image) => ({
            posts_id: post.id,
            img_name: image.filename,
            path: image.path
        }));
        await Posts_Images.bulkCreate(imageFiles);

    }

    // service that deletes the post by its id.
    static async deleteBlogPost(userInfo, postInfo) {

        if (userInfo.id != postInfo.users_id)
            throw new CustomError('Invalid user trying to delete post', 401);

        let deleted = await Posts.destroy({ where: { id: postInfo.id } });
        if (deleted)
            postInfo.images.map((image) => deleteImageFile(image.path));
        else
            throw new CustomError('Couldn\'t delete post', 400);

        return (deleted) ? true : false;
    }

    static async updateBlogPost(userInfo, postInfo, updatePostInfo, images) {

        // Error if user is not the author of the post.
        if (userInfo.id != postInfo.users_id)
            throw new CustomError('Invalid user trying to update post', 401);

        // check updated fields
        const updatedFields = {
            title: updatePostInfo.title,
            excerpt: updatePostInfo.excerpt,
            description: updatePostInfo.description,
        };

        // update the fields of the post
        const updated = await Posts.update(updatedFields, {
            where: { id: postInfo.id }
        });

        if (![updated]) {
            throw new CustomError('Could not update post', 400);
        }

        // update tags are given then add tags too.
        if (updatePostInfo.tags) {
            const toAddTags = await checkTags(updatePostInfo.tags);
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