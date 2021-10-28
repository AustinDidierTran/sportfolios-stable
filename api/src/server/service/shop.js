import {
  addCartItem,
  deleteCartItem as deleteCartItemHelper,
  getAllShopItems,
  getCartItem,
  getCartItems,
  getCartItemsOrdered as getCartItemsOrderedHelper,
  getCartTotal as getCartTotalHelper,
  getItem as getItemHelper,
  getPurchases as getPurchasesHelper,
  getSales as getSalesHelper,
  getShopItems,
  removeAllInstancesFromCart as removeAllInstancesFromCartHelper,
  removeCartItemInstance as removeCartItemInstanceHelper,
  updateCartItems as updateCartItemsHelper,
} from '../../db/queries/shop.js';

import {
  deleteMembershipWithId,
  deletePersonFromEvent,
  deletePlayerFromRoster,
  deleteTeamFromEvent,
} from '../../db/queries/entity-deprecate.js';

import {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  CART_ITEM,
} from '../../../../common/enums/index.js';
import { isAllowed } from '../../db/queries/utils.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';

const getItem = async (stripePriceId, userId) => {
  return getItemHelper(stripePriceId, userId);
};

const getItems = async entityId => {
  return getShopItems(entityId);
};
const getAllItems = async type => {
  return getAllShopItems(type);
};

const getCart = async userId => {
  const items = await getCartItems(userId);
  const total = await getCartTotal(userId);
  return { items, total };
};

const getCartTotal = async userId => {
  return getCartTotalHelper(userId);
};

const getCartItemsOrdered = async (entityId, userId) => {
  return getCartItemsOrderedHelper(userId);
};

const addToCart = async (body, userId) => {
  await addCartItem(body, userId);
  return getCartItems(userId);
};

const getPurchases = async userId => {
  return getPurchasesHelper(userId);
};

const getSales = async (query, userId) => {
  if (
    !(await isAllowed(query.id, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return getSalesHelper(query);
};

const updateCartItems = async (body, userId) => {
  await updateCartItemsHelper(body, userId);

  const items = await getCartItems(userId);
  const total = await getCartTotal(userId);
  return { items, total };
};

const removeCartItemInstance = async (query, userId) => {
  await removeCartItemInstanceHelper(query, userId);
  return getCartItems(userId);
};

const removeAllInstancesFromCart = async (query, userId) => {
  await removeAllInstancesFromCartHelper(query, userId);
  return getCartItems(userId);
};

const deleteCartItem = async query => {
  const { cartItemId } = query;
  const cartItem = await getCartItem(cartItemId);
  const { metadata } = cartItem;
  const { type } = metadata;

  if (type === GLOBAL_ENUM.TEAM || type === GLOBAL_ENUM.EVENT) {
    const { team, person } = metadata;

    if (team) {
      const { isIndividualOption } = metadata;
      if (isIndividualOption) {
        await deletePlayerFromRoster({
          personId: metadata.personId,
          rosterId: metadata.rosterId,
        });
      } else {
        await deleteTeamFromEvent({
          eventId: metadata.eventId,
          rosterId: metadata.rosterId,
        });
      }
    }
    if (person) {
      await deletePersonFromEvent({
        personId: person.id,
        eventId: metadata.eventId,
      });
    }
  }
  if (type === CART_ITEM.MEMBERSHIP) {
    await deleteMembershipWithId(metadata.id);
  }
  return deleteCartItemHelper(cartItemId);
};

const deleteAllCartItems = async userId => {
  const cartItems = await getCartItems(userId);
  const res = await Promise.all(
    cartItems.map(async c => {
      return deleteCartItem({ cartItemId: c.id });
    }),
  );
  return res;
};

export {
  addToCart,
  deleteAllCartItems,
  deleteCartItem,
  getAllItems,
  getCart,
  getCartItemsOrdered,
  getCartTotal,
  getItem,
  getItems,
  getPurchases,
  getSales,
  removeAllInstancesFromCart,
  removeCartItemInstance,
  updateCartItems,
};
