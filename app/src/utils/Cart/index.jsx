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

export { groupBy, groupedCart, getNbInCart };
