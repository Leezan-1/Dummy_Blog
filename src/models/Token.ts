
import { Table, Model, Column, DataType, BelongsTo, ForeignKey, Scopes } from 'sequelize-typescript';
import { User } from './User';

@Scopes(() => ({
    byJti: (jti: string) => ({ where: { jti: jti } }),
    byUser: (userId: number) => ({ where: { user_id: userId } }),
}))
@Table({
    modelName: "Token",
    tableName: "token",
    timestamps: true,
    updatedAt: false,
})
export class Token extends Model {

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    jti!: string

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
        unique: true,
    })
    refresh_token!: string

    @Column({
        type: DataType.BIGINT,
    })
    refresh_tokens_expiry?: bigint

    @Column({
        type: DataType.STRING(500),
        allowNull: false,
        unique: true,
    })
    access_token!: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user_id!: boolean

    @BelongsTo(() => User)
    user!: User
}

