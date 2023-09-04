import {
  Model,
  Column,
  Table,
  PrimaryKey,
  DataType,
  CreatedAt,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  UpdatedAt
} from "sequelize-typescript";

import { AppUserAccountStatus } from "types/db-models";

@Table({ tableName : "app_user" })
export class UserAccount extends Model {

  @AutoIncrement
  @PrimaryKey
  @Column(DataType.BIGINT)
  public id! : number;

  @Column({ type : DataType.STRING })
  public username! : string;

  @Column({ type : DataType.STRING })
  public password! : string;

  @Column({ type : DataType.STRING })
  public email! : string;

  @Column({ type : DataType.STRING })
  public fullName! : string;

  @Column({
    type : DataType.BIGINT,
    defaultValue : 0
  })
  public balance! : number;

  @Column({
    type : DataType.BIGINT,
    defaultValue : 0
  })
  public balanceTransactionMark! : number;

  @Column({
    type : DataType.STRING,
    defaultValue : AppUserAccountStatus.Disabled
  })
  public status! : AppUserAccountStatus;

  @CreatedAt
  @Column
  public createdDateTime! : Date;

  @UpdatedAt
  @Column
  public updatedDateTime! : Date;

}

