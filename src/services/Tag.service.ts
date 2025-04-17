import { Tag } from "../models/Tag";
import CustomError from "../utils/CustomError.utils";
import { validateTags } from "../utils/validation.utils";

export default class TagService {

    static async getAllTags(): Promise<Tag[]> {
        return Tag.findAll();
    }

    static async getSingleTag(tagName: string, id?: number): Promise<Tag | null> {

        return Tag.findOne({ where: { name: tagName } });
    }

    static async checkTagsExist(tagName: string | string[]): Promise<boolean> {
        // all validations logics and db check go here
        let tagExist: Tag | null = null;

        if (typeof tagName === "string") {
            tagExist = await this.getSingleTag(tagName);
        }
        return (tagExist) ? true : false;
    }

    static async createTag(newTagName: string): Promise<Tag> {

        // validate tag name
        validateTags(newTagName);

        // check tag exist in db
        if (await this.checkTagsExist(newTagName))
            throw new CustomError(400, "tag name already exist");

        // extra careful
        const createdTag = await Tag.create({ name: newTagName });
        if (!createdTag)
            throw new CustomError(400, "tag could not be created");

        return createdTag;
    }

    static async updateTag(newTagName: string, prevTagName: string): Promise<void> {

        validateTags(newTagName);
        validateTags(prevTagName);

        if (! await this.getSingleTag(prevTagName))
            throw new CustomError(404, "tag does not exist");

        if (prevTagName == newTagName || await this.getSingleTag(newTagName))
            throw new CustomError(400, "tag already exist");

        await Tag.update({ name: newTagName }, { where: { name: prevTagName } });
    }

    static async deleteTag(tagName: string): Promise<void> {
        validateTags(tagName);

        if (! await this.getSingleTag(tagName))
            throw new CustomError(404, "tag does not exist");
        if (! await Tag.destroy({ where: { name: tagName } }))
            throw new CustomError(400, "tag could not be deleted");
    }
}
