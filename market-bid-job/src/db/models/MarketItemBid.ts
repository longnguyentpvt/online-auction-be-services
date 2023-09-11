import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey
} from "sequelize";
import sequelize from "../seq";

import { UserAccount } from "./UserAccount";
import { MarketItem } from "./MarketItem";
import { BidStatus } from "types/db-models";

export class MarketItemBid
  extends Model<InferAttributes<MarketItemBid>, InferCreationAttributes<MarketItemBid>> {

  declare id: CreationOptional<number>;

  declare bidderId: ForeignKey<UserAccount["id"]>;
  declare itemId: ForeignKey<MarketItem["id"]>;
  declare price: number;
  declare status: BidStatus;
  declare createdDateTime: CreationOptional<Date>;
  declare updatedDateTime: CreationOptional<Date>;
}

MarketItemBid.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  price: { type: DataTypes.BIGINT },
  status: { type: DataTypes.STRING },
  createdDateTime: { type: DataTypes.DATE },
  updatedDateTime: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: "market_item_bid",
  freezeTableName : true,
  createdAt: "createdDateTime",
  updatedAt: "updatedDateTime"
});
