
import {
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
  CART_ITEM,
} from '../../../../common/enums/index.js';

import * as shopQueries from '../../db/queries/shop.js'
import * as eventQueries from '../../db/queries/event.js';

export const getForYouPagePosts = async () => {
  const events = await eventQueries.getEventVerified();
  const merch = await shopQueries.getActiveStoreItemsAllInfos();

  const fullEvents = await Promise.all(
    events.map(async event => {

      return {
        type: GLOBAL_ENUM.EVENT,
        cardType: CARD_TYPE_ENUM.EVENT,
        eventId: event.id,
        photoUrl: event.photo_url,
        startDate: event.start_date,
        endDate: event.end_date,
        quickDescription: event.quick_description,
        description: event.description,
        location: event.location,
        name: event.name,
        createdAt: event.created_at,
        creator: {
          id: event.creatorEntities.id,
          type: event.creatorEntities.type,
          name: event.creatorEntities.entitiesGeneralInfos.name,
          surname: event.creatorEntities.entitiesGeneralInfos.surname,
          photoUrl: event.creatorEntities.entitiesGeneralInfos.photo_url,
        },
      };
    }),
  );
  const fullMerch = merch
    .filter(m => m.metadata.type === CART_ITEM.EVENT)
    .map(item => ({
      type: CART_ITEM.SHOP_ITEM,
      cardType: CARD_TYPE_ENUM.SHOP,
      label: item.label,
      amount: item.amount,
      photoUrl: item.photo_url,
      description: item.description,
      stripePriceId: item.stripe_price_id,
      stripeProductId: item.stripe_product_id,
      createdAt: item.created_at,
    }));

  return [...fullEvents, ...fullMerch].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}