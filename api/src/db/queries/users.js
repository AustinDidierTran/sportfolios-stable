const {
  GLOBAL_ENUM,
  ENTITIES_ROLE_ENUM,
} = require('../../../../common/enums');
const bcrypt = require('bcrypt');

const {
  createUserEmail,
  generateHashedPassword,
  getBasicUserInfoFromId,
  getEmailsFromUserId,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  sendNewConfirmationEmailAllIncluded,
  updateBasicUserInfoFromUserId,
  updatePasswordFromUserId,
  getPrimaryPersonIdFromUserId,
  sendPersonTransferEmailAllIncluded,
  updatePrimaryPerson: updatePrimaryPersonHelper,
  getPeopleTransferedToUser: getPeopleTransferedToUserHelper,
  transferPerson: transferPersonHelper,
  cancelPersonTransfer: cancelPersonTransferHelper,
  declinePersonTransfer: declinePersonTransferHelper,
} = require('../helpers');

const {
  getAllOwnedEntities,
  personIsAwaitingTransfer,
} = require('../helpers/entity');

const { isAllowed } = require('./entity');

const sendTransferPersonEmail = async (
  user_id,
  { email, sendedPersonId },
) => {
  return sendPersonTransferEmailAllIncluded({
    email,
    sendedPersonId,
    senderUserId: user_id,
  });
};

const cancelPersonTransfer = async (user_id, personId) => {
  if (!(await isAllowed(personId, user_id))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return cancelPersonTransferHelper(personId);
};

const addEmail = async (user_id, { email }) => {
  if (!user_id) {
    return 402;
  }

  // validate there is no user with said email
  const email_user_id = await getUserIdFromEmail(email);

  if (email_user_id) {
    return 403;
  }

  await createUserEmail({ user_id, email });

  await sendNewConfirmationEmailAllIncluded(email);

  return 200;
};

const changePassword = async (
  user_id,
  { oldPassword, newPassword },
) => {
  if (!user_id) {
    return 402;
  }
  const newHashedPassword = await generateHashedPassword(newPassword);

  const oldHashedPassword = await getHashedPasswordFromId(user_id);

  if (!oldHashedPassword) {
    return 404;
  }

  const isSame = bcrypt.compareSync(oldPassword, oldHashedPassword);

  if (!isSame) {
    return 403;
  }

  await updatePasswordFromUserId({
    id: user_id,
    hashedPassword: newHashedPassword,
  });

  return 200;
};

const changeUserInfo = async (user_id, { language }) => {
  if (!user_id) {
    return 402;
  }

  await updateBasicUserInfoFromUserId({
    user_id,
    language,
  });

  return 200;
};

const getEmails = async userId => {
  const emails = await getEmailsFromUserId(userId);

  if (!emails) {
    return { status: 403 };
  }

  return { status: 200, emails };
};

const userInfo = async id => {
  const basicUserInfo = await getBasicUserInfoFromId(id);

  if (!basicUserInfo) {
    return { status: 403 };
  }
  // get basic user info
  return { basicUserInfo, status: 200 };
};

const getPrimaryPersonId = async userId => {
  const id = await getPrimaryPersonIdFromUserId(userId);
  if (!id) {
    return { status: 403 };
  }

  return { status: 200, id };
};

const getOwnedAndTransferedPersons = async userId => {
  const [owned, transfered] = await Promise.all([
    getOwnedPersons(userId),
    getPeopleTransferedToUser(userId),
  ]);
  return owned.concat(transfered);
};

const getOwnedPersons = async userId => {
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
};

const updatePrimaryPerson = async (body, userId) => {
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
};

const getPeopleTransferedToUser = async userId => {
  return (await getPeopleTransferedToUserHelper(userId)).map(
    person => {
      const { photo_url: photoUrl, ...otherProps } = person;
      return { photoUrl, isAwaitingApproval: true, ...otherProps };
    },
  );
};

const transferPerson = async (personId, userId) => {
  return transferPersonHelper(personId, userId);
};

const declinePersonTransfer = async personId => {
  return declinePersonTransferHelper(personId);
};

module.exports = {
  addEmail,
  changePassword,
  changeUserInfo,
  getEmails,
  userInfo,
  getPrimaryPersonId,
  getOwnedPersons,
  updatePrimaryPerson,
  sendTransferPersonEmail,
  cancelPersonTransfer,
  getPeopleTransferedToUser,
  transferPerson,
  declinePersonTransfer,
  getOwnedAndTransferedPersons,
};
