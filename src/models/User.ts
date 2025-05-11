import { Model, Table, Column, DataType, HasMany, HasOne, Scopes } from 'sequelize-typescript';
import { Token } from './Token';
import { Post } from './Post';
import { Profile } from './Profile';
import { Otp } from './Otp';


@Table({
    tableName: "user",
    modelName: "User",
    timestamps: true,
    updatedAt: false
})
export class User extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
        unique: true
    })
    uuid!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    first_name!: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    last_name!: string

    @Column({
        type: DataType.STRING(50),
        unique: true,
        allowNull: false
    })
    email!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false
    })
    verified!: boolean;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        unique: true
    })
    username!: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    password!: string

    // associations 1:1 Profile
    @HasOne(() => Profile)
    profile!: Profile;

    // @HasOne(() => Otp)
    // otp!: Otp;

    // association 1:N Tokens
    @HasMany(() => Token)
    tokens!: Token[];

    // associations 1:N Posts
    @HasMany(() => Post)
    posts!: Post[];
}
