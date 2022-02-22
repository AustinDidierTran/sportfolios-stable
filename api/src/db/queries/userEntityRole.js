import { userEntityRole } from '../models/userEntityRole';

export const insertUserEntityRole = async body => {
  const { userId, entityId, role } = body;

  const returnValue = await userEntityRole
    .query()
    .insertGraph({
      user_id: userId,
      entity_id: entityId,
      role,
    })
    .returning('*');

  return {
    userId: returnValue.user_id,
    entityId: returnValue.entity_id,
    role: returnValue.role,
  };
};
