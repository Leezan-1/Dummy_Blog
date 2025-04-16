import { Table, Model, Column, DataType, BelongsTo, ForeignKey, PrimaryKey } from 'sequelize-typescript';
import { User } from './User';

@Table({
    tableName: "profile",
    modelName: "Profile",
    timestamps: true
})
export class Profile extends Model {
    @PrimaryKey
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: true
    })
    user_id!: number

    @BelongsTo(() => User)
    user!: User
}