import { Model, Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { Post } from './Post';
import { Tag } from './Tag';

@Table({
    tableName: 'post_tag',
    modelName: 'Post_Tag',
})
export class Post_Tag extends Model {

    @ForeignKey(() => Post)
    @Column({ type: DataType.INTEGER })
    post_id!: number

    @ForeignKey(() => Tag)
    @Column({ type: DataType.INTEGER })
    tag_id!: number

}