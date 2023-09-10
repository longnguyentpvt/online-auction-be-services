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

export class MarketItem
  extends Model<InferAttributes<MarketItem>, InferCreationAttributes<MarketItem>> {

  declare id: CreationOptional<number>;
  declare ownerId: ForeignKey<UserAccount["id"]>;
  declare name: string;
  declare startPrice: number;
  declare currentBidPrice: number;
  declare bidProcessMark: number;
  declare released: number;
  declare createdDateTime: CreationOptional<Date>;
  declare publishedDateTime: CreationOptional<Date>;
  declare endDateTime: CreationOptional<Date>;
  declare updatedDateTime: CreationOptional<Date>;

  declare owner?: NonAttribute<UserAccount>;
  declare static associations: {
    owner: Association<MarketItem, UserAccount>;
  };
}

MarketItem.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING },
  startPrice: { type: DataTypes.BIGINT },
  currentBidPrice: { type: DataTypes.BIGINT },
  bidProcessMark: { type: DataTypes.BIGINT },
  released: { type: DataTypes.TINYINT },
  createdDateTime: { type: DataTypes.DATE },
  publishedDateTime: { type: DataTypes.DATE },
  endDateTime: { type: DataTypes.DATE },
  updatedDateTime: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: "market_item",
  freezeTableName: true,
  createdAt: "createdDateTime",
  updatedAt: "updatedDateTime"
});
