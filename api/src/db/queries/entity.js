import { entities } from '../models/entities.js';

export const deleteEventById = async (entity_id) => {
  return await entities
    .query()
    .delete()
    .where({
      'id': entity_id,
    });
}
export const restoreEventById = async (entity_id) => {
  return await entities
    .query()
    .patch({
      deleted_at: null
    })    
    .where({
      'id': entity_id
    });
}
