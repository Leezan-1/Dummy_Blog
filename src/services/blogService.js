const { Posts, Posts_Images, Posts_Tags, Tags } = require('../models').sequelize.models;

class BlogService {

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
}

module.exports = BlogService;