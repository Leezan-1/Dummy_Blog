// models and services
import { Tag } from "../models/Tag";
// utility functions & classes
import CustomError from "../utils/CustomError.utils";
import { validateTags } from "../utils/validation.utils";


export default class TagService {

    static async getAllTags(): Promise<Tag[]> {
        return Tag.findAll();
    }

    static async getSingleTag(tagName: string, id?: number): Promise<Tag | null> {

        return Tag.findOne({ where: { name: tagName } });
    }

    static async checkTagsExist(tagName: string | string[]): Promise<Tag | Tag[] | null> {
        // all validations logics and db check go here

        if (typeof tagName === "string") {
            return await this.getSingleTag(tagName);
        }
        else {
            const allTags = await this.getAllTags();
            let allTagsInstances: Tag[] = [];
            for (const tag of allTags) {
                for (const tagNam of tagName) {
                    if (tagNam === tag.name)
                        allTagsInstances.push(tag);
                }
            }
            return allTagsInstances!;
        }
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
