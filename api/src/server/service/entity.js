import {
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums/index.js';

import * as eventQueries from '../../db/queries/event.js';

export const getForYouPagePosts = async () => {
  const events = await eventQueries.getEventVerified();

  const fullEvents = events.map(event => ({
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
  }));

  return fullEvents.sort((a, b) => b.createdAt - a.createdAt);
};
