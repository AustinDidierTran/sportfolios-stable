import { GLOBAL_ENUM, ENTITIES_ROLE_ENUM, PERSON_TRANSFER_STATUS_ENUM, STATUS_ENUM } from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import bcrypt from 'bcrypt';

import {
  generateHashedPassword,
  getBasicUserInfoFromId,
  getEmailsFromUserId,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  updateBasicUserInfoFromUserId,
  updatePasswordFromUserId,
  getPrimaryPersonIdFromUserId,
  sendPersonTransferEmailAllIncluded,
  confirmEmail,
  updatePrimaryPerson as updatePrimaryPersonHelper,
  updateNewsLetterSubscription as updateNewsLetterSubscriptionHelper,
  useToken as useTokenHelper,
  getPeopleTransferedToUser as getPeopleTransferedToUserHelper,
  transferPerson as transferPersonHelper,
  getTokenPromoCode as getTokenPromoCodeHelper,
  cancelPersonTransfer as cancelPersonTransferHelper,
  declinePersonTransfer as declinePersonTransferHelper,
  getTransferInfosFromToken as getTransferInfosHelper,
  validateEmailIsConfirmed,
  isRegistered,
  createConfirmationEmailToken,
  createUserEmail,
} from '../../db/queries/user.js';

import { getAllOwnedEntities, personIsAwaitingTransfer } from '../../db/queries/entity-deprecate.js';
import { generateAuthToken, generateToken, isAllowed } from '../../db/queries/utils.js';
import { validateEmailIsUnique } from '../../db/queries/auth.js';

async function sendTransferPersonEmail(
  userId,
  { email, sendedPersonId },
) {
  if (
    (await getEmailsFromUserId(userId)).find(e => e.email == email)
  ) {
    throw new Error(ERROR_ENUM.VALUE_IS_INVALID);
  }
  return sendPersonTransferEmailAllIncluded({
    email,
    sendedPersonId,
    senderUserId: userId,
  });
}

async function cancelPersonTransfer(userId, personId) {
  if (!(await isAllowed(personId, userId))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return cancelPersonTransferHelper(personId);
}

async function changePassword(userId, { oldPassword, newPassword }) {
  if (!userId) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const newHashedPassword = await generateHashedPassword(newPassword);

  const oldHashedPassword = await getHashedPasswordFromId(userId);

  if (!oldHashedPassword) {
    return STATUS_ENUM.ERROR;
  }

  const isSame = bcrypt.compareSync(oldPassword, oldHashedPassword);

  if (!isSame) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }

  await updatePasswordFromUserId({
    id: userId,
    hashedPassword: newHashedPassword,
  });

  return STATUS_ENUM.SUCCESS;
}

async function changeUserInfo(userId, { language }) {
  if (!userId) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  await updateBasicUserInfoFromUserId({
    userId,
    language,
  });

  return STATUS_ENUM.SUCCESS;
}

export const addEmail = async (userId, email) => {
  if (!userId) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  if (!email) {
    throw new Error(ERROR_ENUM.INVALID_EMAIL);
  }
  const isUnique = await validateEmailIsUnique(email);

  if (!isUnique) {
    throw new Error(ERROR_ENUM.INVALID_EMAIL);
  }
  await createUserEmail({ userId, email });
  await confirmEmail({ email });

  return STATUS_ENUM.SUCCESS;
}

async function getEmails(userId) {
  const emails = await getEmailsFromUserId(userId);

  if (!emails) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }

  return emails;
}

async function userInfo(id) {
  const basicUserInfo = await getBasicUserInfoFromId(id);

  if (!basicUserInfo) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }
  // get basic user info
  return basicUserInfo;
}

async function getOwnedAndTransferedPersons(userId) {
  const [owned, transfered] = await Promise.all([
    (await getOwnedPersons(userId)).filter(
      person => person.role === ENTITIES_ROLE_ENUM.ADMIN,
    ),
    getPeopleTransferedToUser(userId),
  ]);
  const concat = owned.concat(transfered);

  //Permet de mettre la primary person comme 1er élément de la liste
  concat.sort((a, b) =>
    a.isPrimaryPerson ? -1 : b.isPrimaryPerson ? 1 : 0,
  );

  return concat;
}

async function getOwnedPersonsRegistration(eventId, userId) {
  const [owned, transfered] = await Promise.all([
    (await getOwnedPersons(userId)).filter(
      person => person.role === ENTITIES_ROLE_ENUM.ADMIN,
    ),
    getPeopleTransferedToUser(userId),
  ]);
  const concat = owned.concat(transfered);
  //Permet de mettre la primary person comme 1er élément de la liste
  for (var i = 0; i < concat.length; i++) {
    if (concat[i].isPrimaryPerson) {
      concat.unshift(concat.splice(i, 1)[0]);
      break;
    }
  }

  const registered = await Promise.all(
    concat.map(async c => ({
      ...c,
      registered: await isRegistered(c.id, eventId),
    })),
  );
  return registered;
}

async function getOwnedPersons(userId) {
  const persons = await getAllOwnedEntities(
    GLOBAL_ENUM.PERSON,
    userId,
  );

  const primaryPersonId = await getPrimaryPersonIdFromUserId(userId);
  if (!persons || !primaryPersonId) {
    return;
  }
  var res = await Promise.all(
    persons.map(async person => {
      const isPrimaryPerson = person.id == primaryPersonId;
      const isToBeTransfered = await personIsAwaitingTransfer(
        person.id,
      );
      const obj = { ...person, isPrimaryPerson, isToBeTransfered };
      return obj;
    }),
  );
  return res;
}

async function updatePrimaryPerson(body, userId) {
  const { primaryPersonId } = body;
  if (
    !(await isAllowed(
      primaryPersonId,
      userId,
      ENTITIES_ROLE_ENUM.ADMIN,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return updatePrimaryPersonHelper(userId, primaryPersonId);
}
async function useToken(body) {
  const { tokenId } = body;
  return useTokenHelper(tokenId);
}

async function getPeopleTransferedToUser(userId) {
  return (await getPeopleTransferedToUserHelper(userId)).map(
    person => {
      const { photo_url: photoUrl, ...otherProps } = person;
      return { photoUrl, isAwaitingApproval: true, ...otherProps };
    },
  );
}

async function transferPerson(personId, userId) {
  return transferPersonHelper(personId, userId);
}

async function getTokenPromoCode(body) {
  const { token } = body;
  return getTokenPromoCodeHelper(token);
}

async function declinePersonTransfer(personId) {
  return declinePersonTransferHelper(personId);
}

async function getTransferInfos(token) {
  const infos = await getTransferInfosHelper(token);
  if (!infos) {
    //Token does not exists
    return;
  }
  const { email, person_id, status, expires_at } = infos;
  const userId = await getUserIdFromEmail(email);
  let authToken, userInfo;
  if (userId) {
    //Login the user
    if (!(await validateEmailIsConfirmed(email))) {
      await createConfirmationEmailToken({
        email,
        token: await generateToken(),
      });
    }
    await confirmEmail({ email });
    authToken = await generateAuthToken(userId);
    userInfo = await getBasicUserInfoFromId(userId);
  }
  const isPending =
    status === PERSON_TRANSFER_STATUS_ENUM.PENDING &&
    expires_at > Date.now();
  return {
    email,
    personId: person_id,
    isPending,
    userInfo,
    authToken,
  };
}

async function updateNewsLetterSubscription(userId, body) {
  const subscription = await updateNewsLetterSubscriptionHelper(
    userId,
    body,
  );
  return subscription;
}

export {
  cancelPersonTransfer,
  changePassword,
  changeUserInfo,
  declinePersonTransfer,
  getEmails,
  getOwnedAndTransferedPersons,
  getOwnedPersons,
  getOwnedPersonsRegistration,
  getPeopleTransferedToUser,
  getTokenPromoCode,
  getTransferInfos,
  sendTransferPersonEmail,
  transferPerson,
  updateNewsLetterSubscription,
  updatePrimaryPerson,
  userInfo,
  useToken,
};
