const fs = require('fs');
const { Op } = require('sequelize');
const crypto = require('crypto');
const toJson = require('../utils/toJson');
const { default: slugify } = require('slugify');
const CustomError = require('../utils/CustomError');
const { Posts, Posts_Images, Posts_Tags, Tags } = require('../models').sequelize.models;

async function generateSlug(title) {
    let slug = slugify(title, { trim: true, lower: true, strict: true });

    let buffer = await crypto.randomBytes(12)
    slug += `-${buffer.toString('hex')}`;

    return slug;
}

async function checkTags(tagArray) {
    const tagInstance = await Promise.all(tagArray.map((tagName) => Tags.findOrCreate({ where: { name: tagName.trim() } })));
    return tagInstance.map(([item]) => item);
}

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
        await post.setTags(toAddTags);

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

        let images = await Posts_Images.findAll({ where: { posts_id: postInfo.id } });

        let deleted = await Posts.destroy({ where: { id: postInfo.id } });
        if (deleted)
            toJson(images).forEach(image => fs.unlinkSync(image.path));
        else
            throw new CustomError('Couldn\'t delete post', 400);

        return (deleted) ? true : false;
    }

    static async updateBlogPost(userInfo, postInfo, updatePostInfo, images) {

        // Error if user isnot the author of post.
        if (userInfo.id != postInfo.users_id)
            throw new CustomError('Invalid user trying to update post', 401);

        // check updated fields
        const updatedFields = {
            excerpt: updatePostInfo.excerpt,
            description: updatePostInfo.description,
        };



        // If title is not same update slug and add to updated fields.
        if (postInfo.title !== updatePostInfo.title) {

            //update title and also slug to new title.
            updatedFields.title = updatePostInfo.title;
            updatedFields.slug = await generateSlug(updatePostInfo.title);

            let postExist = await Posts.findOne({
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

        const toAddTags = await checkTags(updatePostInfo?.tags);

        // update tags too.
        await updated.setTags(toAddTags);

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