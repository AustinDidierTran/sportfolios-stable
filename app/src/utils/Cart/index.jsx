import { GLOBAL_ENUM } from '../../../../common/enums';
import { getMembershipName } from '../../../../common/functions';

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const groupedCart = cart => {
  const grouped = groupBy(cart, item => item.stripe_price_id);
  const keys = Array.from(grouped.keys());
  const groupedItems = keys.map(key => {
    return {
      ...cart.find(e => e.stripe_price_id == key),
      nbInCart: grouped.get(key).length,
    };
  });
  return groupedItems;
};

const getNbInCart = (cart, key) => {
  return cart.find(e => e.stripe_price_id == key).nbInCart;
};

const getProductName = type => {
  if (
    type === GLOBAL_ENUM.MEMBERSHIP ||
    type === GLOBAL_ENUM.SHOP_ITEM
  ) {
    return type;
  }
  if (type === GLOBAL_ENUM.EVENT) {
    return 'event';
  }
  return '';
};

const getProductDetail = metadata => {
  if (metadata.type === GLOBAL_ENUM.MEMBERSHIP) {
    const res = getMembershipName(metadata.membership_type);
    return res;
  }
  if (metadata.type === GLOBAL_ENUM.SHOP_ITEM) {
    return '';
  }
  if (metadata.type === GLOBAL_ENUM.EVENT) {
    if (metadata.isIndividualOption) {
      return `${metadata.event.basicInfos.name} | registration for ${metadata.name} | ${metadata.team.name}`;
    }
    return `${metadata.event.basicInfos.name} | registration for ${metadata.team.name}`;
  }
  return '';
};

export {
  groupBy,
  groupedCart,
  getNbInCart,
  getProductName,
  getProductDetail,
};
