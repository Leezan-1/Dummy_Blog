import { Op } from 'sequelize';
import { Model, Table, Column, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany, Scopes } from 'sequelize-typescript';
import { Tag } from './Tag';
import { User } from './User';
import { Post_Tag } from './Post_Tag';
import { Post_Images } from './Post_Images';

@Scopes(() => ({

    includeUser: () => ({
        include: [
            {
                model: User,
                as: "author",
                attributes: ["username"],
                required: true,
                right: true,
            }
        ]
    }),

    includeImages: () => ({
        include: [
            {
                model: Post_Images,
                as: "images",
            },
        ]
    }),
    includeTags: () => ({
        include: [
            {
                model: Tag,
                as: "tags",
                through: {
                    attributes: []
                },
            }
        ]
    }),

    filterByTags: (tagName: string[]) => ({

        include: [{
            model: Tag,
            as: "tagFilter",
            through: { attributes: [] },
            where: { name: { [Op.in]: tagName } },
            attributes: [],
            required: Boolean(tagName.length)
        }]
    }),


}))

@Table({
    tableName: "post",
    modelName: "Post",
    timestamps: true,
})
export class Post extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.UUID,
        unique: true,
        allowNull: false,
        defaultValue: DataType.UUIDV4
    })
    uuid!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title!: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    slug!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    excerpt!: string;

    @Column({
        type: DataType.TEXT,
        defaultValue: '',
        allowNull: true
    })
    description?: string;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
        allowNull: false
    })
    view_count!: number;

    @Column({
        type: DataType.STRING,
        defaultValue: null,
        allowNull: true
    })
    thumbnail?: string;

    @Column({
        type: DataType.STRING,
        defaultValue: null,
        allowNull: true
    })
    thumbnail_path?: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    })
    featured!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    })
    visible!: boolean;

    @ForeignKey(() => User,)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    user_id!: number;

    @BelongsTo(() => User, { as: "author" })
    author!: User;

    @HasMany(() => Post_Images, { as: "images" })
    images!: Post_Images[];

    @BelongsToMany(() => Tag, {
        through: () => Post_Tag,  // Through model
        as: 'tags'            // Custom alias (you can choose any name)
    })
    tags!: Tag[];

    @BelongsToMany(() => Tag, {
        through: () => Post_Tag,
        as: "tagFilter"
    })
    tagFilter?: Tag[];

}