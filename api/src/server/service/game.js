import {
  CART_ITEM,
  ENTITIES_ROLE_ENUM,
} from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';

import * as queries from '../../db/queries/game.js';
import * as ticketQueries from '../../db/queries/ticket.js';

import {
  addProduct,
  addPrice,
} from '../../db/queries/stripe/shop.js';
import { isAllowed } from '../../db/queries/utils.js';

export const postTicketOption = async (body, userId) => {
  const {
    creatorId,
    description,
    eventId,
    name,
    photoUrl,
    price,
  } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  // Create the stripe product
  const stripeProduct = await addProduct({
    stripeProduct: {
      name,
      active: true,
      description,
      metadata: {
        type: CART_ITEM.EVENT_TICKET,
        id: eventId,
      },
    },
  });

  // Create the stripe price
  const stripePrice = await addPrice({
    stripePrice: {
      currency: 'cad',
      unit_amount: price,
      active: true,
      product: stripeProduct.id,
      metadata: {
        type: CART_ITEM.EVENT_TICKET,
        id: eventId,
      },
    },
    entityId: eventId,
    photoUrl,
    ownerId: creatorId,
    taxRatesId: [], // To support tax rates
  });

  const gameId = await queries.getGameFromEvent(eventId);

  // Insert inside the event ticket options
  const res = await ticketQueries.createEventTicketOption(
    stripePrice.id,
    name,
    description,
    gameId,
    photoUrl,
  );
  return res;
};

export const addTicketsToCart = async (body /* userId */) => {
  const { ticketSelection } = body;

  const ticketOptions = await ticketQueries.getTicketOptionsById(
    Object.keys(ticketSelection),
  );
  // eslint-disable-next-line
  const ticketOrder = ticketOptions
    .map(to => ({
      id: to.id,
      stripe_price_id: to.stripe_price_id,
      game_id: to.game_id,
      quantity: ticketSelection[to.id],
    }))
    .filter(to => to.quantity);
};

export const submitSpiritScore = async (body, userId) => {
  const {
    submittedByPerson,
    submittedByRoster,
    submittedForRoster,
    gameId,
    spiritScore,
    comment,
  } = body;

  if (
    !(await isAllowed(
      submittedByPerson,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  if (
    queries.isSpiritAlreadySubmmited(
      gameId,
      submittedByRoster,
      submittedForRoster,
    )
  )
    // Add spirit to score submission
    await queries.submitSpiritScore({
      submittedByPerson,
      submittedByRoster,
      submittedForRoster,
      gameId,
      spiritScore,
      comment,
    });

  // As of now, set the score of the game to the said spirit
  await queries.updateGameSpirit({
    submittedForRoster,
    gameId,
    spiritScore,
  });
};

export const updateGameInfo = async (body, userId) => {
  const { name, ticketLimit, description, gameId } = body;

  if (!isAllowed(id, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  await queries.updateGameInfo(gameId, {
    name,
    ticketLimit,
    description,
  });

  return true;
};

export const updateGameScore = async (body, userId) => {
  const { eventId, gameId, rosters } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  await queries.updateTeamGameScores(gameId, rosters);

  return gameId;
};

export const getPurchasedTickets = async (
  { eventId, gameId, returnAllTickets },
  userId,
) => {
  let finalGameId = gameId;

  if (!finalGameId) {
    finalGameId = await queries.getGameFromEvent(eventId);
  }

  const purchasedTickets = await ticketQueries.getPurchasedTicketsByGameId(
    finalGameId,
  );

  const purchasedTicketsObject = purchasedTickets.map(
    (paid, index) => ({
      id: paid.id,
      buyer: {
        email: paid.stripeInvoiceItem.userEmail.email,
        primaryPerson: {
          id: paid.stripeInvoiceItem.user_id,
          name: paid.stripeInvoiceItem.userPrimaryPerson.entitiesGeneralInfos.name,
          surname: paid.stripeInvoiceItem.userPrimaryPerson.entitiesGeneralInfos.surname,
          photoUrl: paid.stripeInvoiceItem.userPrimaryPerson.entitiesGeneralInfos.photo_url,
          verifiedAt: paid.stripeInvoiceItem.userPrimaryPerson.entitiesGeneralInfos.entities.verified_at,
          deletedAt: paid.stripeInvoiceItem.userPrimaryPerson.entitiesGeneralInfos.entities.deleted_at,
        }
      },
      number: index + 1,
      option: {
        id: paid.eventTicketOptions.id,
        name: paid.eventTicketOptions.name,
        description: paid.eventTicketOptions.description,
        price: paid.eventTicketOptions.stripePrice.amount
      }
    }),
  );

  if (returnAllTickets && returnAllTickets !== 'false') {
    if (!isAllowed(gameId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
      throw new Error(ERROR_ENUM.ACCESS_DENIED);
    }
    return purchasedTicketsObject;
  }

  return purchasedTicketsObject.filter(
    ticket => ticket.buyer.primaryPerson.id === userId,
  );
};
