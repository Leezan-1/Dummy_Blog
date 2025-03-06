const { Posts, Posts_Images, Posts_Tags, Tags } = require('../models').sequelize.models;
const { default: slugify } = require('slugify');
const CustomError = require('../utils/CustomError');
const { Op } = require('sequelize');

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
        return JSON.parse(JSON.stringify(post));
    }

    // fetches post by its id.
    static async getSinglePostByID(post_id) {

        const post = await Posts.findByPk(post_id);
        if (!post)
            throw new CustomError('Post not found', 404);
        return JSON.parse(JSON.stringify(post));

    }

    // service that creates new blog post
    static async createBlogPost(userInfo, postInfo, postImages) {

        postInfo.slug = slugify(postInfo.title, { strict: true, trim: true, lower: true });
        let postExist = await Posts.findOne({
            where: {
                [Op.or]: [{ title: postInfo.title }, { slug: postInfo.slug }]
            }
        });
        if (postExist)
            throw new CustomError('Post already exists', 406);


        const post = await Posts.create({
            title: postInfo.title,
            slug: postInfo.slug,
            excerpt: postInfo.excerpt,
            description: postInfo?.description,
            users_id: userInfo.id
        });

        console.log('post :>> ', post);

        let imageFiles = postImages.map((image) => ({
            posts_id: post.id,
            img_name: image.filename,
            path: image.path
        }));

        await Posts_Images.bulkCreate(imageFiles);
        // postImages.forEach((images) => {
        //     const post_image = await Posts_Images.build({
        //         img_name: images.filename,
        //         post_id: post.dataValues.id
        //     });
        // });

        // await post.save();
    }

    // service that deletes the post by its id.
    static async deleteBlogPost(userInfo, postInfo) {

        if (userInfo.id != postInfo.users_id)
            throw new CustomError('Invalid user trying to delete post', 401);


        let deleted = await Posts.destroy({ where: { id: postInfo.id } });
        if (!deleted)
            throw new CustomError('Couldn\'t delete post', 400);
    }

    static async updateBlogPost(userInfo, postInfo, updatedPostInfo) {
        // Error if user isnot the author of post.
        if (userInfo.id != postInfo.users_id)
            throw new CustomError('Invalid user trying to update post', 401);

        // generates and checks slug with updated title if it already exits
        updatedPostInfo.slug = slugify(updatedPostInfo.title, { strict: true, trim: true });
        let postExist = await Posts.findOne({
            where: {
                [Op.or]: [{ title: updatedPostInfo.title }, { slug: updatedPostInfo.slug }]
            }
        });

        // if posts already exits, its an error!.
        if (postExist)
            throw new CustomError('Post already exists', 406);

        let updatedPost = await Posts.update(
            {
                title: updatedPostInfo.title,
                slug: updatedPostInfo.slug,
                excerpt: updatedPostInfo.excerpt,
                description: updatedPostInfo?.description,
            },
            { where: { id: postInfo.id } }
        );

        // if updated is not 1, then it is an error
        if (!updatedPost)
            throw new CustomError('Could not updated user data!', 400);

        return updatedPost;
    }
}

module.exports = BlogService;