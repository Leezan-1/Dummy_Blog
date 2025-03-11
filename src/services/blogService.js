const fs = require('fs');
const { Op } = require('sequelize');
const { default: slugify } = require('slugify');
const CustomError = require('../utils/CustomError');
const toJson = require('../utils/toJson');
const { Posts, Posts_Images, Posts_Tags, Tags } = require('../models').sequelize.models;



class BlogService {

    // gets all posts joining images and tags
    static async getAllPosts() {
        const allPosts = await Posts.findAll({
            include: [
                {
                    model: Posts_Images,
                    as: 'images',
                },
                {
                    model: Tags,
                    as: 'tags',
                    through: { attributes: [] }
                }
            ]
        });

        if (!allPosts)
            throw new CustomError('No post found', 404);

        return JSON.parse(JSON.stringify(allPosts));
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
                        model: Posts_Images,
                        as: 'images',
                        attributes: ["img_name", "path"],
                    },
                    {
                        model: Tags,
                        as: "tags",
                        // required: true,
                    }
                ]
            }
        );

        if (!post)
            throw new CustomError('Post not found', 404);

        return toJson(post);

    }

    // service that creates new blog post
    static async createBlogPost(userInfo, formPostInfo, postImages) {

        formPostInfo.slug = slugify(formPostInfo.title, { strict: true, trim: true, lower: true });
        let postExist = await Posts.findOne({
            where: {
                [Op.or]: [{ title: formPostInfo.title }, { slug: formPostInfo.slug }]
            }
        });
        if (postExist)
            throw new CustomError('Post already exists', 401);


        const post = await Posts.create({
            title: formPostInfo.title,
            slug: formPostInfo.slug,
            excerpt: formPostInfo.excerpt,
            description: formPostInfo?.description,
            users_id: userInfo.id
        });

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

        let images = await Posts_Images.findAll({ where: { posts_id: postInfo.id } });

        let deleted = await Posts.destroy({ where: { id: postInfo.id } });
        if (deleted)
            toJson(images).forEach(image => fs.unlinkSync(image.path));
        else
            throw new CustomError('Couldn\'t delete post', 400);

        return (deleted) ? true : false;
    }

    static async updateBlogPost(userInfo, postInfo, updatedPostInfo, images) {

        // Error if user isnot the author of post.
        if (userInfo.id != postInfo.users_id)
            throw new CustomError('Invalid user trying to update post', 401);

        // check updated fields
        const updatedFields = {
            excerpt: updatedPostInfo.excerpt,
            description: updatedPostInfo.description,
        }

        // If title is not same update slug and add to updated fields.
        if (postInfo.title !== updatedPostInfo.title) {
            updatedFields.title = updatedPostInfo.title;
            updatedFields.slug = slugify(postInfo.title, { strict: true, trim: true, lower: true });

            const postExist = await Posts.findOne({
                where: {
                    [Op.or]: [{ title: updatedFields.title }, { slug: updatedFields.slug }],
                    id: { [Op.ne]: postInfo.id }
                }
            });

            if (postExist)
                throw new CustomError('Post title and slug already exists!');


        }

        // update the fields of the post
        const updated = await Posts.update(updatedFields, {
            where: { id: postInfo.id }
        });
        if (!updated) {
            throw new CustomError('Couldnot update post', 400);
        }

        // previous img destroyed.!
        let prevImgDestroyed = await Posts_Images.destroy({ where: { posts_id: postInfo.id } });
        if (!prevImgDestroyed) {
            throw new CustomError('Couldnot update post', 200);
        }

        // every images is deleted
        postInfo.images.forEach((image) => {
            fs.unlinkSync(image.path);
        });

        // prepares image file to create
        let imageFiles = images.map((image) => ({
            posts_id: postInfo.id,
            img_name: image.filename,
            path: image.path
        }));

        // updates new image
        let newImgUpdated = await Posts_Images.bulkCreate(imageFiles);
        if (!newImgUpdated)
            throw new CustomError('Couldnot update image');
    }

    static async updateBlogViewCount(postInfo) {
        let updatedPost = await Posts.update(
            {
                view_count: postInfo.view_count + 1
            },
            {
                where: { id: postInfo.id }
            }
        );
        // if updated is not 1, then it is an error
        if (!updatedPost)
            throw new CustomError('Could not updated user data!', 400);

        return updatedPost;
    }
}

module.exports = BlogService;