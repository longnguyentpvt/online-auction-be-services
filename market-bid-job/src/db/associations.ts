import { MarketItem } from "./models/MarketItem";
import { MarketItemBid } from "./models/MarketItemBid";
import { UserAccount } from "./models/UserAccount";
import { AccountTransaction } from "./models/AccountTransaction";

UserAccount.hasMany(MarketItem, {
  sourceKey: "id",
  foreignKey: "ownerId",
  as: "items"
});

MarketItem.belongsTo(UserAccount, {
  foreignKey: "ownerId",
  as: "owner"
});

UserAccount.hasMany(AccountTransaction, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "transactions"
});

AccountTransaction.belongsTo(UserAccount, {
  foreignKey: "userId",
  as: "user"
});

MarketItemBid.belongsTo(UserAccount, {
  foreignKey: "bidderId"
});
MarketItemBid.belongsTo(MarketItem, {
  foreignKey: "itemId"
});
