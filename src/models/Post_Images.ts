import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Post } from './Post';

@Table({
    tableName: 'post_images',
    modelName: 'Post_Images',
    timestamps: false,
})
export class Post_Images extends Model {

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    img_name!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    path!: string

    @ForeignKey(() => Post)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    post_id!: number

    @BelongsTo(() => Post)
    post!: Post

}