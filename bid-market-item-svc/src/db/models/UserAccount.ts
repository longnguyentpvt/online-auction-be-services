import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Association
} from "sequelize";
import sequelize from "../seq";

import { MarketItem } from "./MarketItem";

export class UserAccount
  extends Model<InferAttributes<UserAccount>, InferCreationAttributes<UserAccount>> {

  declare id: number;
  declare balance: number;
  declare balanceTransactionMark: number;

  declare items?: NonAttribute<MarketItem[]>;
  declare static associations: {
    items: Association<UserAccount, MarketItem>;
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
