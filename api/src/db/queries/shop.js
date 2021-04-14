const {
  addCartItem,
  deleteCartItem: deleteCartItemHelper,
  getAllShopItems,
  getCartItem,
  getCartItems,
  getCartItemsOrdered: getCartItemsOrderedHelper,
  getCartTotal: getCartTotalHelper,
  getItem: getItemHelper,
  getPurchases: getPurchasesHelper,
  getSales: getSalesHelper,
  getShopItems,
  removeAllInstancesFromCart: removeAllInstancesFromCartHelper,
  removeCartItemInstance: removeCartItemInstanceHelper,
  updateCartItems: updateCartItemsHelper,
} = require('../helpers/shop');

const {
  deleteMembershipWithId,
  deletePersonFromEvent,
  deletePlayerFromRoster,
  deleteTeamFromEvent,
  getEntityRole: getEntityRoleHelper,
} = require('../helpers/entity');
const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
} = require('../../../../common/enums');

async function isAllowed(entityId, userId, acceptationRole) {
  const role = await getEntityRoleHelper(entityId, userId);
  return role <= acceptationRole;
}

const getItem = async (stripePriceId, userId) => {
  return getItemHelper(stripePriceId, userId);
};

const getItems = async (entityId, userId) => {
  return getShopItems(entityId, userId);
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

const getSales = async (entityId, userId) => {
  if (
    !(await isAllowed(entityId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return getSalesHelper(entityId);
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
          teamId: team.id,
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
  if (type === GLOBAL_ENUM.MEMBERSHIP) {
    await deleteMembershipWithId(metadata.id);
  }
  await deleteCartItemHelper(cartItemId);
};

const deleteAllCartItems = async userId => {
  const cartItems = await getCartItems(userId);
  await Promise.all(
    cartItems.map(async c => {
      await deleteCartItem({ cartItemId: c.id });
    }),
  );
};

module.exports = {
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
