import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Association
} from "sequelize";
import sequelize from "../seq";

import { AccountTransaction } from "./AccountTransaction";

export class UserAccount
  extends Model<InferAttributes<UserAccount>, InferCreationAttributes<UserAccount>> {

  declare id: number;
  declare balance: number;
  declare balanceTransactionMark: number;

  declare transactions?: NonAttribute<AccountTransaction[]>;
  declare static associations: {
    transactions: Association<UserAccount, AccountTransaction>;
  };
}

UserAccount.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  balance: { type: DataTypes.BIGINT },
  balanceTransactionMark: { type: DataTypes.BIGINT }
}, {
  sequelize,
  modelName: "app_user",
  freezeTableName: true,
  timestamps: false
});
