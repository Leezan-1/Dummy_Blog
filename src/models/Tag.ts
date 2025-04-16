import { Model, Table, Column, DataType, BelongsToMany } from 'sequelize-typescript';
import { Post } from './Post';
import { Post_Tag } from './Post_Tag';


@Table({
    tableName: 'tag',
    modelName: 'Tag',
})
export class Tag extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.STRING(15),
        unique: true,
        allowNull: false
    })
    name!: string

    @BelongsToMany(() => Post, () => Post_Tag)
    posts!: Post[]
}
