import { Model, Table, Column, DataType, ForeignKey, BelongsTo, Scopes, NotNull, HasOne } from 'sequelize-typescript';
import { User } from './User';
import { OtpPurpose } from '../enums/OtpPurpose.enum';

@Table({
    modelName: "Otp",
    tableName: "otp",
    timestamps: false,
})
export class Otp extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })
    id!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        unique: true,
    })
    token!: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false,
    })
    jwtToken!: string;

    @Column({
        type: DataType.ENUM(...Object.values(OtpPurpose)),
    })
    purpose!: string;




    // @Column({
    //     type: DataType.ENUM("reset-password", "verify-email"),
    //     default: "reset-password"
    // })
    // purpose!: string;

    // @ForeignKey(() => User)
    // @Column({
    //     type: DataType.INTEGER,
    //     allowNull: false,
    // })
    // user_id!: number;

    // @HasOne(() => User)
    // user!: User;

}