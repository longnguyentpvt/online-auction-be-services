import { MarketItem, MarketItemBidder, Op } from "db";
import moment from "moment-timezone";
import { ItemBidderReleaseStatus } from "types/db-models";
import {
  releaseBidApi
} from "apis";

const releaseBidderBalance = async (itemBidder: MarketItemBidder): Promise<void> => {
  try {
    const {
      itemId,
      bidderId,
      releaseStatus
    } = itemBidder;

    if (!!releaseStatus) return;

    const [updatedRow] = await MarketItemBidder.update({
      releaseStatus: ItemBidderReleaseStatus.Requested
    }, {
      where: {
        itemId,
        bidderId
      }
    });

    if (updatedRow > 0) {
      // call api to user balance release bid
      console.log("release", {
        itemId,
        bidderId
      });

      await releaseBidApi(bidderId, itemId);
    }
  } catch (e) {
    console.error("Release item error", e);
  }
};

const releaseItemBid = async (item: MarketItem): Promise<void> => {
  try {
    const {
      id
    } = item;
    console.log("releasing", { id });

    const [updatedRow] = await MarketItem.update({
      released: 1
    }, {
      where: {
        id
      }
    });

    if (updatedRow > 0) {
      const itemBidders = await MarketItemBidder.findAll({
        where: {
          itemId: id
        }
      });

      for (const itemBidder of itemBidders) {
        await releaseBidderBalance(itemBidder);
      }
    }
  } catch (e) {
    console.error("Release item error", e);
  }
};

export const releaseEndBid = async (): Promise<void> => {
  const nowMm = moment();

  const endItems = await MarketItem.findAll({
    where: {
      released: 0,
      endDateTime: { [Op.lte]: nowMm.toDate() }
    }
  });

  for (const item of endItems) {
    await releaseItemBid(item);
  }
};
