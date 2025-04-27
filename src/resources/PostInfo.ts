import { Post } from "../models/Post";
import { generateDuration, generateImageURL } from "../utils/generate.utils";
import { pagination } from "../utils/pagination";

export class PostInfo {

    static toResponse(post: Post) {
        // const post = toJson(post);

        return {
            id: post.id,
            uuid: post.uuid,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            thumbnail_image: post?.thumbnail,
            thumbnail_url: generateImageURL(post?.thumbnail_path),
            content: post.description,
            author: `${post.author?.first_name} ${post.author?.last_name}`,
            username: `@${post.author?.username}`,
            duration: generateDuration(post.createdAt),
            images: post?.images?.map((img) => ({
                image_name: img.img_name,
                image_url: generateImageURL(img?.path)
            })),
            tags: post?.tags?.map((tag) => (tag.name)),
            is_visible: post?.visible,
            is_featured: post?.featured,
        }
    }

    static toCollectionResponse(posts: Post[], totalPosts: number, page: number, limit: number) {
        return {
            metadata: pagination(totalPosts, page, limit),
            posts: posts.map((post) => {
                const response = this.toResponse(post);
                delete (response?.content);

                return response;
            }
            )
        };
    }

};