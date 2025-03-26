const toJson = require("../utils/toJson")


const toDuration = (createdAt) => {
    let postDuration;
    let millisecond = Date.now() - Date.parse(createdAt);


    if (millisecond >= 30 * 24 * 60 * 60 * 1000) {
        // If duration is 1 month or more
        postDuration = `${Math.floor(millisecond / (30 * 24 * 60 * 60 * 1000))} months`;
    } else if (millisecond >= 24 * 60 * 60 * 1000) {
        // If duration is 1 day or more
        postDuration = `${Math.floor(millisecond / (24 * 60 * 60 * 1000))} days`;
    } else if (millisecond >= 60 * 60 * 1000) {
        // If duration is 1 hour or more
        postDuration = `${Math.floor(millisecond / (60 * 60 * 1000))} hours`;
    } else if (millisecond >= 60 * 1000) {
        // If duration is 1 minute or more
        postDuration = `${Math.floor(millisecond / (60 * 1000))} minutes`;
    } else {
        // If duration is less than 1 minute
        postDuration = `${Math.floor(millisecond / 1000)} seconds`;
    }

    return postDuration;
}

class PostInfo {

    static toResponse(post) {
        // const post = toJson(post);

        return {
            id: post.id,
            uuid: post.uuid,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.description,
            author: `${post.author.first_name} ${post.author.last_name}`,
            duration: toDuration(post.createdAt),
            images: post.images.map((img) => ({ img_name: img.img_name })),
            tags: post.tags.map((tag) => (tag.name)),
            is_visible: post.visible,
            is_featured: post.featured,
        }
    }

    static toCollectionResponse(post) {
        return {
            id: post?.id,
            uuid: post?.uuid,
            slug: post?.slug,
            title: post?.title,
            excerpt: post?.excerpt,
            author: `${post.author?.first_name} ${post.author?.last_name}`,
            views: post?.view_count,

            duration: toDuration(post?.createdAt),
            tags: post.tags.map((tag) => (tag?.name)),
            is_visible: post?.visible,
            is_featured: post?.featured,
        };
    }

    static toMetadataResponse(metadata) {
        return {

        };
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