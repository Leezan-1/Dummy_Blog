import { Model, Table, Column, DataType, ForeignKey, BelongsTo, Scopes } from 'sequelize-typescript';

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
        type: DataType.STRING,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.INTEGER,
    })
    token!: string;

    @Column(DataType.BIGINT)
    expiry!: bigint;
}