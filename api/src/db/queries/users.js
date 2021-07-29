const {
  GLOBAL_ENUM,
  ENTITIES_ROLE_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  BASIC_CHATBOT_STATES,
  STATUS_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM, errors } = require('../../../../common/errors');
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
  confirmEmail,
  updatePrimaryPerson: updatePrimaryPersonHelper,
  updateNewsLetterSubscription: updateNewsLetterSubscriptionHelper,
  useToken: useTokenHelper,
  getPeopleTransferedToUser: getPeopleTransferedToUserHelper,
  transferPerson: transferPersonHelper,
  getTokenPromoCode: getTokenPromoCodeHelper,
  cancelPersonTransfer: cancelPersonTransferHelper,
  declinePersonTransfer: declinePersonTransferHelper,
  getTransferInfosFromToken: getTransferInfosHelper,
  generateAuthToken,
  generateToken,
  validateEmailIsConfirmed,
  setFacebookData: setFacebookDataHelper,
  getFacebookId,
  deleteFacebookId,
  isLinkedFacebookAccount,
  setMessengerId,
  getMessengerId,
  deleteMessengerId,
  setChatbotInfos,
  isRegistered,
} = require('../helpers');

const {
  getAllOwnedEntities,
  personIsAwaitingTransfer,
} = require('../helpers/entity');

const {
  getMessengerIdFromFbID,
  sendMessage,
} = require('../helpers/facebook');

const { isAllowed } = require('./entity');
const i18n = require('../../i18n.config');
const Response = require('../../server/utils/ChatBot/response');

const sendTransferPersonEmail = async (
  userId,
  { email, sendedPersonId },
) => {
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
};

const cancelPersonTransfer = async (userId, personId) => {
  if (!(await isAllowed(personId, userId))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return cancelPersonTransferHelper(personId);
};

const addEmail = async (userId, { email }) => {
  if (!userId) {
    return STATUS_ENUM.UNAUTHORIZED;
  }

  // validate there is no user with said email
  const emailUserId = await getUserIdFromEmail(email);

  if (emailUserId) {
    return STATUS_ENUM.FORBIDDEN;
  }

  await createUserEmail({ userId, email });

  await sendNewConfirmationEmailAllIncluded(email);

  return STATUS_ENUM.SUCCESS;
};

const changePassword = async (
  userId,
  { oldPassword, newPassword },
) => {
  if (!userId) {
    return STATUS_ENUM.UNAUTHORIZED;
  }
  const newHashedPassword = await generateHashedPassword(newPassword);

  const oldHashedPassword = await getHashedPasswordFromId(userId);

  if (!oldHashedPassword) {
    return STATUS_ENUM.ERROR;
  }

  const isSame = bcrypt.compareSync(oldPassword, oldHashedPassword);

  if (!isSame) {
    return STATUS_ENUM.FORBIDDEN;
  }

  await updatePasswordFromUserId({
    id: userId,
    hashedPassword: newHashedPassword,
  });

  return STATUS_ENUM.SUCCESS;
};

const changeUserInfo = async (userId, { language }) => {
  if (!userId) {
    return STATUS_ENUM.UNAUTHORIZED;
  }
  await updateBasicUserInfoFromUserId({
    userId,
    language,
  });

  return STATUS_ENUM.SUCCESS;
};

const getEmails = async userId => {
  const emails = await getEmailsFromUserId(userId);

  if (!emails) {
    return { status: STATUS_ENUM.FORBIDDEN };
  }

  return { status: STATUS_ENUM.SUCCESS, emails };
};

const userInfo = async id => {
  const basicUserInfo = await getBasicUserInfoFromId(id);

  if (!basicUserInfo) {
    return { status: STATUS_ENUM.FORBIDDEN };
  }
  // get basic user info
  return { basicUserInfo, status: STATUS_ENUM.SUCCESS };
};

const getPrimaryPersonId = async userId => {
  const id = await getPrimaryPersonIdFromUserId(userId);
  if (!id) {
    return { status: STATUS_ENUM.FORBIDDEN };
  }

  return { status: STATUS_ENUM.SUCCESS, id };
};

const getOwnedAndTransferedPersons = async userId => {
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
};

const getOwnedPersonsRegistration = async (eventId, userId) => {
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
const useToken = async body => {
  const { tokenId } = body;
  return useTokenHelper(tokenId);
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

const getTokenPromoCode = async body => {
  const { token } = body;
  return getTokenPromoCodeHelper(token);
};

const declinePersonTransfer = async personId => {
  return declinePersonTransferHelper(personId);
};

const getTransferInfos = async token => {
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
};
const setFacebookData = async (userId, data) => {
  return setFacebookDataHelper(userId, data);
};

const linkFacebook = async (userId, data) => {
  const { facebook_id } = data;
  if (!facebook_id) {
    return;
  }
  if (await isLinkedFacebookAccount(facebook_id)) {
    throw Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return setFacebookDataHelper(userId, data);
};

const getConnectedApps = async userId => {
  const facebookId = await getFacebookId(userId);
  const facebook = {
    connected: Boolean(facebookId),
    id: facebookId,
  };
  const messengerId = await getMessengerId(userId);
  const messenger = {
    connected: Boolean(messengerId),
    id: messengerId,
  };
  let apps = {};
  apps.facebook = facebook;
  apps.messenger = messenger;
  return apps;
};

const unlinkFacebook = async userId => {
  return deleteFacebookId(userId);
};

const linkMessengerFromFBId = async (userId, facebook_id) => {
  const messengerId = await getMessengerIdFromFbID(facebook_id);
  if (!messengerId) {
    throw new errors[ERROR_ENUM.VALUE_IS_INVALID]();
  }
  sendMessage(
    messengerId,
    Response.genText(i18n.__('connection.success')),
  );
  setChatbotInfos(messengerId, { state: BASIC_CHATBOT_STATES.HOME });
  return setMessengerId(userId, messengerId);
};

const unlinkMessenger = async userId => {
  return deleteMessengerId(userId);
};

const updateNewsLetterSubscription = async (userId, body) => {
  const subscription = await updateNewsLetterSubscriptionHelper(
    userId,
    body,
  );
  return subscription;
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
  updateNewsLetterSubscription,
  useToken,
  sendTransferPersonEmail,
  cancelPersonTransfer,
  getPeopleTransferedToUser,
  transferPerson,
  getTokenPromoCode,
  declinePersonTransfer,
  getOwnedAndTransferedPersons,
  getOwnedPersonsRegistration,
  getTransferInfos,
  setFacebookData,
  getConnectedApps,
  unlinkFacebook,
  linkFacebook,
  linkMessengerFromFBId,
  unlinkMessenger,
};
