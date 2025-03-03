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

        return JSON.parse(JSON.stringify(allPosts));
    }

    // get all posts by users_id.
    static async getPostsByUser(u_id) {

    }

    // get single post of a user using slug field of post
    static async getSinglePost(posts_slug) {
    }
}

module.exports = BlogService;