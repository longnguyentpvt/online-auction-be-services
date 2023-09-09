import { MarketItem } from "./models/MarketItem";
import { UserAccount } from "./models/UserAccount";

UserAccount.hasMany(MarketItem, {
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "items"
});

MarketItem.belongsTo(UserAccount, {
  foreignKey: "ownerId",
  as: "owner"
});
