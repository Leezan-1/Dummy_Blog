const CustomError = require('../utils/CustomError');
const toJson = require('../utils/toJson');

const { Tags } = require('../models').sequelize.models;

class TagService {
    static async getAllTags() {

        const allTags = await Tags.findAll();
        return toJson(allTags);
    }

    static async getTagName(tagName) {
        const fectchedTag = await Tags.findOne({ where: { name: tagName } });
        return (fectchedTag) ? toJson(fectchedTag) : false;
    }

    static async createNewTag(tagName) {

        // checks if there is any tag with the name 
        // if (await this.getTagName(tagName))
        // throw new CustomError('Tag name already exist', 400);

        // else creates tag
        let created = await Tags.findOrCreate({ where: { name: tagName, } });

        if (!created)
            throw new CustomError('Tag could not be created!', 400);
    }

    static async updateTag(prevTagName, newTagName) {

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
            throw new CustomError('Couldnot update tag', 400);
    }

    static async deleteTag(tagName) {
        if (!(await this.getTagName(tagName)))
            throw new CustomError('Tag doesnot exist', 404);

        const deleted = await Tags.destroy({ where: { name: tagName } });

    }

}

module.exports = TagService;