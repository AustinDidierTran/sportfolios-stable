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
  updatePrimaryPerson: updatePrimaryPersonHelper,
} = require('../helpers');

const { getAllOwnedEntities } = require('../helpers/entity');

const { isAllowed } = require('./entity');

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

const getOwnedPersons = async userId => {
  const persons = await getAllOwnedEntities(
    GLOBAL_ENUM.PERSON,
    userId,
  );
  const primaryPersonId = await getPrimaryPersonIdFromUserId(userId);
  if (!persons || !primaryPersonId) {
    return { status: 403 };
  }
  var res = await Promise.all(
    persons.map(async person => {
      const isPrimaryPerson = person.id == primaryPersonId;
      const obj = { ...person, isPrimaryPerson };
      return obj;
    }),
  );
  return { status: 200, persons: res };
};

const updatePrimaryPerson = async (body, userId) => {
  const { primaryPersonId } = body;
  if (!isAllowed(primaryPersonId, userId, ENTITIES_ROLE_ENUM.ADMIN)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return await updatePrimaryPersonHelper(userId, primaryPersonId);
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
};
