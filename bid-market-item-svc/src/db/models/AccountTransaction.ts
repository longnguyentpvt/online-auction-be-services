import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  Association
} from "sequelize";
import sequelize from "../seq";

import { UserAccount } from "./UserAccount";

import { TransactionType, TransactionStatus } from "types/db-models";

export class AccountTransaction
  extends Model<InferAttributes<AccountTransaction>, InferCreationAttributes<AccountTransaction>> {

  declare id: CreationOptional<number>;
  declare userId: ForeignKey<UserAccount["id"]>;
  declare type: TransactionType;
  declare amount: number;
  declare status: TransactionStatus;
  declare createdDateTime: CreationOptional<Date>;
  declare updatedDateTime: CreationOptional<Date>;

  declare user?: NonAttribute<UserAccount>;
  declare static associations: {
    user: Association<AccountTransaction, UserAccount>;
  };
}

AccountTransaction.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  type: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  amount: { type: DataTypes.BIGINT },
  createdDateTime: { type: DataTypes.DATE },
  updatedDateTime: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: "account_transaction",
  freezeTableName : true,
  createdAt: "createdDateTime",
  updatedAt: "updatedDateTime"
});
