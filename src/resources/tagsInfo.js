class TagsInfo {
    static sendAllTags(tags) {
        return tags.map((tag) => ({
            tag_name: tag.name
        }));
    }
}

module.exports = TagsInfo;