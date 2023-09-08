import { AccountTransaction } from "./models/AccountTransaction";
import { UserAccount } from "./models/UserAccount";

UserAccount.hasMany(AccountTransaction, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "transactions"
});

AccountTransaction.belongsTo(UserAccount, {
  foreignKey: "userId",
  as: "user"
});
