import { Model, Table, Column, DataType, ForeignKey, BelongsTo, PrimaryKey, AutoIncrement, NotNull } from 'sequelize-typescript';
import { Post } from './Post';
import { User } from './User';

@Table({
    updatedAt: false,
    tableName: "post_comments",
    modelName: "Post_Comments"
})
export class Post_Comments extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.TEXT)
    comments!: string;

    @NotNull
    @ForeignKey(() => Post)
    @Column(DataType.INTEGER)
    post_id!: Post;

    @BelongsTo(() => Post)
    post!: Post;


    @NotNull
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    user_id!: User;

    @BelongsTo(() => User)
    user!: User;

}