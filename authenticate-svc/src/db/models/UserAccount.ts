import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes
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
  declare status: AppUserAccountStatus;
  declare permissionScopes: string[];

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
  status: { type: DataTypes.STRING },
  permissionScopes: { type: DataTypes.JSON }
}, {
  sequelize,
  modelName: "app_user",
  freezeTableName: true,
  timestamps: false
});
