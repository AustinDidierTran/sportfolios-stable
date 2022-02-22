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

export const insertEntitiesGeneralInfos = async body => {
  const {
    entityId,
    description,
    quickDescription,
    name,
    surname,
    photoUrl,
    infosSuppId,
  } = body;

  const newInfos = await entitiesGeneralInfos
    .query()
    .insert({
      entity_id: entityId,
      description,
      quick_description: quickDescription,
      name,
      surname,
      photo_url: photoUrl,
      infos_supp_id: infosSuppId,
    })
    .returning('*');

  return {
    entityId: newInfos.entity_id,
    description: newInfos.description,
    quickDescription: newInfos.quick_description,
    name: newInfos.name,
    surname: newInfos.surname,
    photoUrl: newInfos.photo_url,
    infosSuppId: newInfos.infos_supp_id,
  };
};
