import { entitiesGeneralInfos } from '../models/entitiesGeneralInfos.js';

export const updateEntityPhoto = async (entityId, photoUrl) => {
  return await entitiesGeneralInfos
    .query()
    .update({
      photo_url: photoUrl,
    })
    .where({
      entity_id: entityId,
    });
};
