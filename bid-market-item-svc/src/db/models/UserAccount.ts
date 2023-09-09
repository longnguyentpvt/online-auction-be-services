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
import { AccountTransaction } from "./AccountTransaction";

export class UserAccount
  extends Model<InferAttributes<UserAccount>, InferCreationAttributes<UserAccount>> {

  declare id: number;
  declare balance: number;
  declare balanceTransactionMark: number;
  declare lastBidDateTime: Date;

  declare items?: NonAttribute<MarketItem[]>;
  declare transactions?: NonAttribute<AccountTransaction[]>;

  declare static associations: {
    items: Association<UserAccount, MarketItem>;
    transactions: Association<UserAccount, AccountTransaction>;
  };
}

UserAccount.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  balance: { type: DataTypes.BIGINT },
  balanceTransactionMark: { type: DataTypes.BIGINT },
  lastBidDateTime: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: "app_user",
  freezeTableName: true,
  timestamps: false
});
