const CustomError = require('../utils/CustomError');
const { validateTagName } = require('../utils/validations');

const { Tags } = require('../models');

class TagService {
    static async getAllTags() {

        const allTags = await Tags.findAll();
        return allTags;
    }

    static async getTagName(tagName) {
        const fetchedTag = await Tags.findOne({ where: { name: tagName } });
        return fetchedTag;
    }

    static async createNewTag(tagName) {

        validateTagName(tagName);

        // checks if there is any tag with the name 
        if (await this.getTagName(tagName))
            throw new CustomError('Tag name already exist', 400);

        // else creates tag
        let created = await Tags.create({ name: tagName });

        if (!created)
            throw new CustomError('Tag could not be created!', 400);
    }

    static async updateTag(prevTagName, newTagName) {

        validateTagName(prevTagName);
        validateTagName(newTagName);

        if (!(await this.getTagName(prevTagName)))
            throw new CustomError('Tag does not exist!', 404);

        if (prevTagName != newTagName) {
            if (await this.getTagName(newTagName))
                throw new CustomError('Tag name already exist', 400);
        }

        const updated = await Tags.update(
            { name: newTagName },
            { where: { name: prevTagName } }
        );

        if (![updated])
            throw new CustomError('Could not update tag', 400);
    }

    static async deleteTag(tagName) {
        if (!(await this.getTagName(tagName)))
            throw new CustomError('Tag does not exist', 404);

        await Tags.destroy({ where: { name: tagName } });

    }

}

module.exports = TagService;