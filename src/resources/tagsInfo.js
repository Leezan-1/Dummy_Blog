class TagsInfo {
    static toClient(tag) {
        return {
            tag_name: tag.name
        }
    }
}

module.exports = TagsInfo;