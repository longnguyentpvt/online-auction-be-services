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

export class MarketItemBidder
  extends Model<InferAttributes<MarketItemBidder>, InferCreationAttributes<MarketItemBidder>> {

  declare bidderId: ForeignKey<UserAccount["id"]>;
  declare itemId: ForeignKey<MarketItem["id"]>;
  declare amount: number;
  declare createdDateTime: CreationOptional<Date>;
  declare updatedDateTime: CreationOptional<Date>;
}

MarketItemBidder.init({
  bidderId: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  itemId: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  amount: { type: DataTypes.BIGINT },
  createdDateTime: { type: DataTypes.DATE },
  updatedDateTime: { type: DataTypes.DATE }
}, {
  sequelize,
  modelName: "market_item_bidder",
  freezeTableName : true,
  createdAt: "createdDateTime",
  updatedAt: "updatedDateTime"
});
