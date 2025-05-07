
// models and services
import { Tag } from "../models/Tag";


export class TagsInfo {
    static sendAllTags(tags: Tag[]) {
        return tags.map((tag) => ({
            tag_name: tag.name
        }));
    }
}

module.exports = TagsInfo;