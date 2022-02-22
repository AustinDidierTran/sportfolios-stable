import { userPrimaryPerson } from '../models/userPrimaryPerson';

export const insertUserPrimaryPerson = async body => {
  const { userId, primaryPerson } = body;

  const insertedPrimaryPerson = await userPrimaryPerson.query().insert({
    user_id: userId,
    primary_person: primaryPerson,
  });

  return {
    userId: insertedPrimaryPerson.user_id,
    primaryPerson: insertedPrimaryPerson.primary_person,
  };
};
