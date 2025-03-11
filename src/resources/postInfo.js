const toJson = require("../utils/toJson")

class PostInfo {

    static toPostObj(dbPost) {
        const post = toJson(dbPost);

        return {
            id: post.id,
            uuid: post.uuid,
            title: post.title,
            excerpt: post.excerpt,
            content: post.description,

            images: post.images.map((img) => ({ img_name: img.img_name })),
            tags: post.tags.map((tag) => ({ name: tag.name })),
        }
    }

    // toPostObj() {
    //     return {
    //         id: this.id,
    //         uuid: this.uuid,
    //         title: this.title,
    //         content: this.content,
    //         duration: this.duration,
    //         images: this.images,
    //         tags: this.tags,
    //     }
    // }
};

module.exports = PostInfo;