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

export class AccessToken
  extends Model<InferAttributes<AccessToken, { omit: "user" }>,
    InferCreationAttributes<AccessToken, { omit: "user" }>> {

  declare token: string;
  declare userId: ForeignKey<UserAccount["id"]>;
  declare invalidated: number;
  declare expiry: Date;
  declare createdDateTime: CreationOptional<Date>;
  declare updatedDateTime: CreationOptional<Date>;

  declare user?: NonAttribute<UserAccount>;

  declare static associations: {
    user: Association<AccessToken, UserAccount>;
  };
}

AccessToken.init({
  token: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  userId: { type: DataTypes.BIGINT },
  invalidated: { type: DataTypes.TINYINT },
  expiry: { type: DataTypes.STRING },
  createdDateTime: { type: DataTypes.DATE },
  updatedDateTime: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: "access_token",
  freezeTableName: true,
  createdAt: "createdDateTime",
  updatedAt: "updatedDateTime"
});

AccessToken.belongsTo(UserAccount, {
  foreignKey: "userId",
  as: "user"
});
