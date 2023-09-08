import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import sequelize from "../seq";

import { AppUserAccountStatus } from "types/db-models";

export class UserAccount
  extends Model<InferAttributes<UserAccount>, InferCreationAttributes<UserAccount>> {

  declare id: number;
  declare username: string;
  declare password: string;
  declare email: string;
  declare fullName: string;
  declare balance: number;
  declare balanceTransactionMark: number;
  declare lastBidDateTime: Date;
  declare status: AppUserAccountStatus;
  declare createdDateTime: CreationOptional<Date>;
  declare updatedDateTime: CreationOptional<Date>;

}

UserAccount.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  username: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  fullName: { type: DataTypes.STRING },
  balance: { type: DataTypes.BIGINT },
  balanceTransactionMark: { type: DataTypes.BIGINT },
  lastBidDateTime: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING },
  createdDateTime: { type: DataTypes.DATE },
  updatedDateTime: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: "app_user",
  freezeTableName : true,
  createdAt: "createdDateTime",
  updatedAt: "updatedDateTime"
});
