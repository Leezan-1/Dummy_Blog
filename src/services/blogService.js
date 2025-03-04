const { Posts, Posts_Images, Posts_Tags, Tags } = require('../models').sequelize.models;
const { default: slugify } = require('slugify');
const CustomError = require('../utils/CustomError');
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
    static async createBlogPost(userInfo, postInfo) {

        postInfo.slug = slugify(postInfo.title, { strict: true, trim: true });
        let postExist = await Posts.findOne({ where: { title: postInfo.title, slug: postInfo.slug } });
        if (postExist)
            throw new CustomError('Post already exists', 406);


        const post = await Posts.build({
            title: postInfo.title,
            slug: postInfo.slug,
            excerpt: postInfo.excerpt,
            description: postInfo?.description,
            users_id: userInfo.id
        });

        await post.save();
    }

    static async deleteBlogPost(userInfo, postInfo) {

        if (userInfo.id !== postInfo.users_id)
            throw new CustomError('Invalid user trying to delete post', 401);


        let deleted = await Posts.destroy({ where: { id: postInfo.id } });
        if (!deleted)
            throw new CustomError('Couldn\'t delete post', 400);
    }
}

module.exports = BlogService;