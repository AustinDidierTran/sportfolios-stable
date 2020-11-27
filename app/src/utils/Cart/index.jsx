import {
  GLOBAL_ENUM,
  MEMBERSHIP_TYPE_ENUM,
} from '../../../../common/enums';

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

const getMembershipName = type => {
  if (type === MEMBERSHIP_TYPE_ENUM.RECREATIONAL) {
    return 'Recreational member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.COMPETITIVE) {
    return 'Competitive member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.ELITE) {
    return 'Elite member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.JUNIOR) {
    return 'Junior member';
  } else {
    return '';
  }
};
const getProductDetail = metadata => {
  switch (metadata.type) {
    case GLOBAL_ENUM.MEMBERSHIP:
      return getMembershipName(metadata.membership_type);
    case GLOBAL_ENUM.SHOP_ITEM:
      return '';
    case GLOBAL_ENUM.EVENT:
      if (metadata.isIndividualOption) {
        return `${metadata.event.basicInfos.name} | registration for ${metadata.name} | ${metadata.team.name}`;
      }
      return `${metadata.event.basicInfos.name} | registration for ${metadata.team.name}`;
    default:
      return '';
  }
};

export {
  groupBy,
  groupedCart,
  getNbInCart,
  getProductName,
  getProductDetail,
};
