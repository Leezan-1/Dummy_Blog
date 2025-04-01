const imageUrlGenerator = require("../utils/imageUrlGenerator");

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
            id: post?.id,
            uuid: post?.uuid,
            slug: post?.slug,
            title: post?.title,
            excerpt: post?.excerpt,
            thumbnail_image: post?.thumbnail,
            thumbnail_url: imageUrlGenerator(post?.thumbnail_path),
            content: post?.description,
            author: `${post?.author.first_name} ${post?.author.last_name}`,
            username: `@${post?.author.username}`,
            duration: toDuration(post?.createdAt),
            images: post?.images?.map((img) => ({
                image_name: img.img_name,
                image_url: imageUrlGenerator(img?.path)
            })),
            tags: post?.tags?.map((tag) => (tag.name)),
            is_visible: post?.visible,
            is_featured: post?.featured,
        }
    }

    static toCollectionResponse(posts, paginationData) {
        return {
            metadata: {
                total_posts: paginationData?.totalPosts,
                total_pages: paginationData?.totalPages,
                current_page: paginationData?.currentPage,
                prev_page: paginationData?.prevPage,
                next_page: paginationData?.nextPage
            },
            posts: posts?.map((post) => {
                const response = this.toResponse(post);
                delete (response?.tags);
                delete (response?.content);
                delete (response?.images);
                // {

                //     id: post?.id,
                //     uuid: post?.uuid,
                //     slug: post?.slug,
                //     title: post?.title,
                //     excerpt: post?.excerpt,
                //     // thumbnail_image: post?.thumbnail,
                //     // thumbnail_url: image_url_generator(post?.thumbnail_path),
                //     author: `${post?.author?.first_name} ${post?.author?.last_name}`,
                //     views: post?.view_count,

                //     duration: toDuration(post?.createdAt),
                //     tags: post?.tags?.map((tag) => (tag?.name)),
                //     is_visible: post?.visible,
                //     is_featured: post?.featured,
                // }
                return response;
            }
            )
        };
    }

};

module.exports = PostInfo;