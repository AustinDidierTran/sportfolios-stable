const knex = require('../connection');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');
const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  COUPON_CODE_ENUM,
  NOTIFICATION_ARRAY,
} = require('../../../../common/enums');

const { EXPIRATION_TIMES } = require('../../../../common/constants');
const {
  sendConfirmationEmail,
  sendPersonTransferEmail,
} = require('../../server/utils/nodeMailer');
const { ERROR_ENUM } = require('../../../../common/errors');
const randtoken = require('rand-token');

const confirmEmail = async ({ email }) => {
  await knex('user_email')
    .update('confirmed_email_at', new Date())
    .where({ email });
};

const createUserEmail = async body => {
  const { userId, email } = body;

  await knex('user_email').insert({ user_id: userId, email });
};

const createUserComplete = async body => {
  const {
    password,
    email,
    name,
    surname,
    facebook_id,
    newsLetterSubscription,
  } = body;

  await knex.transaction(async trx => {
    // Create user
    const [user_id] = await knex('users')
      .insert({ password })
      .returning('id')
      .transacting(trx);

    // Create user email
    await knex('user_email')
      .insert({
        user_id,
        email,
        is_subscribed: newsLetterSubscription,
      })
      .transacting(trx);

    // Create user info
    const [entity_id] = await knex('entities')
      .insert({
        type: GLOBAL_ENUM.PERSON,
      })
      .returning('id')
      .transacting(trx);

    await knex('entities_general_infos')
      .insert({
        entity_id,
        name,
        surname,
      })
      .transacting(trx);

    await knex('user_entity_role')
      .insert({
        user_id,
        entity_id,
        role: ENTITIES_ROLE_ENUM.ADMIN,
      })
      .transacting(trx);

    await knex('user_primary_person')
      .insert({ user_id, primary_person: entity_id })
      .transacting(trx);
    //Set app connections
    await knex('user_apps_id')
      .insert({
        user_id,
        facebook_id,
      })
      .transacting(trx);

    await Promise.all(
      NOTIFICATION_ARRAY.map(async notif => {
        await knex('user_notification_setting')
          .insert({
            user_id,
            type: notif.type,
            email: notif.email,
            chatbot: notif.chatbot,
            in_app: notif.inApp,
          })
          .transacting(trx);
      }),
    );
    return trx;
  });
};

const createConfirmationEmailToken = async ({ email, token }) => {
  await knex('confirmation_email_token').insert({
    email,
    token: token,
    expires_at: new Date(
      Date.now() + EXPIRATION_TIMES.EMAIL_CONFIRMATION_TOKEN,
    ),
  });
};

const createPersonTransferToken = async ({
  email,
  personId,
  token,
  senderId,
}) => {
  return knex('transfered_person')
    .insert({
      email,
      token,
      person_id: personId,
      sender_id: senderId,
      expires_at: new Date(
        Date.now() + EXPIRATION_TIMES.PERSON_TRANSFER_TOKEN,
      ),
    })
    .returning('*');
};

const createRecoveryEmailToken = async ({ userId, token }) => {
  await knex('recovery_email_token').insert({
    user_id: userId,
    token,
    expires_at: new Date(
      Date.now() + EXPIRATION_TIMES.ACCOUNT_RECOVERY_TOKEN,
    ),
  });
};

const generateHashedPassword = async password => {
  if (!password) {
    throw new Error(ERROR_ENUM.VALUE_IS_REQUIRED);
  }
  if (password.length < 8 || password.length > 24) {
    throw new Error(ERROR_ENUM.VALUE_IS_INVALID);
  }
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const generateToken = () => {
  return uuidv1();
};

const generatePromoCodeToken = () => {
  const token = randtoken.generate(6);
  return token;
};

const generateAuthToken = async userId => {
  const token = generateToken();
  await knex('user_token').insert({
    user_id: userId,
    token_id: token,
    expires_at: new Date(Date.now() + EXPIRATION_TIMES.AUTH_TOKEN),
  });
  return token;
};

const generateMemberImportToken = async (
  organizationId,
  expirationDate,
  membershipType,
  email,
) => {
  const token = await generatePromoCodeToken();
  try {
    await knex('token_promo_code').insert({
      token_id: token,
      expires_at: new Date(
        Date.now() + EXPIRATION_TIMES.IMPORT_MEMBER,
      ),
      email,
      metadata: {
        type: COUPON_CODE_ENUM.BECOME_MEMBER,
        organizationId,
        expirationDate: new Date(expirationDate),
        membershipType,
      },
    });
  } catch (err) {
    return generateMemberImportToken(
      organizationId,
      expirationDate,
      membershipType,
    );
  }
  return token;
};

const getBasicUserInfoFromId = async user_id => {
  const [{ app_role } = {}] = await knex('user_app_role')
    .select(['app_role'])
    .where({ user_id });
  const [{ language } = {}] = await knex('users')
    .select('language')
    .where({ id: user_id });
  const [primaryPerson] = await knex('user_entity_role')
    .select(
      'user_entity_role.entity_id',
      'name',
      'surname',
      'photo_url',
    )
    .leftJoin(
      'entities',
      'user_entity_role.entity_id',
      '=',
      'entities.id',
    )
    .leftJoin(
      'entities_general_infos',
      'user_entity_role.entity_id',
      '=',
      'entities_general_infos.entity_id',
    )
    .where('entities.type', GLOBAL_ENUM.PERSON)
    .andWhere({
      'user_entity_role.entity_id': await getPrimaryPersonIdFromUserId(
        user_id,
      ),
    });
  // soon to be changed/deprecated
  const persons = await knex('user_entity_role')
    .select(
      'user_entity_role.entity_id',
      'name',
      'surname',
      'photo_url',
    )
    .leftJoin(
      'entities',
      'user_entity_role.entity_id',
      '=',
      'entities.id',
    )
    .leftJoin(
      'entities_general_infos',
      'user_entity_role.entity_id',
      '=',
      'entities_general_infos.entity_id',
    )
    .where('entities.type', GLOBAL_ENUM.PERSON)
    .andWhere({ user_id });

  return {
    primaryPerson: {
      personId: primaryPerson.entity_id,
      name: primaryPerson.name,
      photoUrl: primaryPerson.photo_url,
      surname: primaryPerson.surname,
    },
    persons: persons.map(person => ({
      personId: person.entity_id,
      name: person.name,
      photoUrl: person.photo_url,
      surname: person.surname,
    })),
    appRole: app_role,
    language,
    userId: user_id,
  };
};

const isRegistered = async (personId, eventId) => {
  const [res] = await knex('event_persons')
    .select('*')
    .where({ person_id: personId, event_id: eventId });
  return Boolean(res);
};

const getEmailsFromUserId = async userId => {
  if (!userId) {
    return [];
  }

  const emails = await knex('user_email')
    .select(['email', 'confirmed_email_at', 'is_subscribed'])
    .where({ user_id: userId });

  return emails;
};

const getEmailFromUserId = async userId => {
  if (!userId) {
    return [];
  }

  const [email] = await knex('user_email')
    .select(['email', 'confirmed_email_at', 'is_subscribed'])
    .where({ user_id: userId });

  return email;
};

const getEmailFromToken = async ({ token }) => {
  const response = await knex('confirmation_email_token')
    .select(['email', 'expires_at'])
    .where({ token });

  if (!response.length || Date.now() > response[0].expires_at) {
    return null;
  }

  return response[0].email;
};

const getHashedPasswordFromId = async id => {
  const [{ password } = {}] = await knex('users')
    .where({ id })
    .returning(['password']);

  return password;
};

const getPrimaryPersonIdFromUserId = async user_id => {
  const [{ primary_person: id }] = await knex('user_primary_person')
    .select('primary_person')
    .where({ user_id });
  return id;
};

const getUserIdFromEmail = async email => {
  const [{ user_id } = {}] = await knex('user_email')
    .select(['user_id'])
    .where({ email });
  return user_id;
};

const getLanguageFromEmail = async email => {
  const id = await getUserIdFromEmail(email);
  if (!id) {
    return;
  }
  return getLanguageFromUser(id);
};

const getLanguageFromUser = async id => {
  return (
    await knex('users')
      .select('language')
      .first()
      .where({ id })
  ).language;
};

const getUserIdFromRecoveryPasswordToken = async token => {
  const [response] = await knex('recovery_email_token')
    .select(['user_id', 'expires_at', 'used_at'])
    .where({ token });

  if (
    !response ||
    response.used_at ||
    Date.now() > response.expires_at
  ) {
    return null;
  }

  return response.user_id;
};

const getUserIdFromMessengerId = async messenger_id => {
  const [res] = await knex('user_apps_id')
    .where({ messenger_id })
    .select('user_id');
  if (res) {
    return res.user_id;
  }
};

const setRecoveryTokenToUsed = async token => {
  await knex('recovery_email_token')
    .update({ used_at: new Date() })
    .where({ token });
};

const updateBasicUserInfoFromUserId = async ({
  userId,
  language,
}) => {
  await knex('users')
    .update({ language })
    .where({ id: userId });
};

const updatePasswordFromUserId = async ({ hashedPassword, id }) => {
  await knex('users')
    .update({ password: hashedPassword })
    .where({ id });
};

const updatePrimaryPerson = async (userId, primary_person) => {
  return knex('user_primary_person')
    .update({ primary_person })
    .where({ user_id: userId })
    .returning('*');
};

const updateNewsLetterSubscription = async (userId, body) => {
  const { email, subscription } = body;
  const [res] = await knex('user_email')
    .update({ is_subscribed: subscription })
    .where({ user_id: userId, email: email })
    .returning('*');
  return res;
};

const useToken = async tokenId => {
  return knex('token_promo_code')
    .update({ used: true })
    .where({ token_id: tokenId })
    .returning('*');
};

const validateEmailIsConfirmed = async email => {
  const response = await knex('user_email')
    .where({ email })
    .returning(['confirmed_email_at']);

  return response.length && response[0].confirmed_email_at !== null;
};

const validateEmailIsUnique = async email => {
  const users = await knex('user_email')
    .where({ email })
    .returning(['id']);
  return !users.length;
};

const sendNewConfirmationEmailAllIncluded = async (
  email,
  successRoute,
) => {
  const confirmationEmailToken = generateToken();
  const language = await getLanguageFromEmail(email);

  await createConfirmationEmailToken({
    email,
    token: confirmationEmailToken,
  });

  await sendConfirmationEmail({
    email,
    language,
    token: confirmationEmailToken,
    successRoute,
  });
};

const sendPersonTransferEmailAllIncluded = async ({
  email,
  sendedPersonId,
  senderUserId,
}) => {
  const personTransferToken = generateToken();
  const sender = await getBasicUserInfoFromId(senderUserId);
  const language =
    (await getLanguageFromEmail(email)) || sender.language;
  const senderPrimaryPersonId = await getPrimaryPersonIdFromUserId(
    senderUserId,
  );
  const senderPrimaryPerson = sender.persons.find(
    person => person.entity_id === senderPrimaryPersonId,
  );
  const senderName =
    senderPrimaryPerson.name + ' ' + senderPrimaryPerson.surname;

  const sendedPerson = sender.persons.find(
    person => person.entity_id === sendedPersonId,
  );
  const sendedName = sendedPerson.name + ' ' + sendedPerson.surname;
  //TODO Save token in db with person id and email
  const res = await createPersonTransferToken({
    email,
    token: personTransferToken,
    personId: sendedPersonId,
    senderId: senderUserId,
  });
  if (!res) {
    return;
  }

  const res2 = await sendPersonTransferEmail({
    email,
    sendedName,
    senderName,
    language,
    token: personTransferToken,
  });

  //Reversing the insert in db if the email can't be sent
  if (!res2) {
    await cancelPersonTransfer(sendedPersonId);
    return;
  }
  return res;
};

const getPeopleTransferedToUser = async userId => {
  const emailsAndConfirmed = await getEmailsFromUserId(userId);
  const emails = emailsAndConfirmed
    .filter(email => email.confirmed_email_at)
    .map(email => email.email);
  return getPeopleTransferedToEmails(emails);
};

const getPeopleTransferedToEmails = async emails => {
  const peopleId = knex
    .select('person_id')
    .from('transfered_person')
    .whereIn('email', emails)
    .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING);
  return knex('person_all_infos')
    .select('*')
    .whereIn('id', peopleId);
};

const transferPerson = async (personId, userId) => {
  return knex.transaction(async trx => {
    const id = await knex('user_entity_role')
      .update({ user_id: userId })
      .where('entity_id', personId)
      .andWhere('role', ENTITIES_ROLE_ENUM.ADMIN)
      .returning('entity_id')
      .transacting(trx);

    await knex('transfered_person')
      .update('status', PERSON_TRANSFER_STATUS_ENUM.ACCEPTED)
      .where({ person_id: personId })
      .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
      .transacting(trx);
    return id;
  });
};

const getTokenPromoCode = async tokenId => {
  const [res] = await knex('token_promo_code')
    .select('*')
    .where({
      token_id: tokenId,
    });
  return res;
};

const cancelPersonTransfer = async personId => {
  const [person] = await knex('transfered_person')
    .where({ person_id: personId })
    .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
    .update('status', PERSON_TRANSFER_STATUS_ENUM.CANCELED)
    .returning('person_id');
  return person;
};

const declinePersonTransfer = async personId => {
  const [person] = await knex('transfered_person')
    .where({ person_id: personId })
    .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
    .update('status', PERSON_TRANSFER_STATUS_ENUM.REFUSED)
    .returning('person_id');
  return person;
};

const getTransferInfosFromToken = async token => {
  return knex('transfered_person')
    .select('*')
    .where({ token })
    .first();
};

const getUserIdFromAuthToken = async token => {
  const [{ user_id } = {}] = await knex('user_token')
    .select('user_id')
    .where('token_id', token)
    .whereRaw('expires_at > now()');

  return user_id;
};

module.exports = {
  confirmEmail,
  createUserEmail,
  createUserComplete,
  createConfirmationEmailToken,
  createRecoveryEmailToken,
  generateHashedPassword,
  generateToken,
  generateAuthToken,
  generateMemberImportToken,
  getBasicUserInfoFromId,
  getEmailFromToken,
  getEmailsFromUserId,
  getEmailFromUserId,
  getHashedPasswordFromId,
  getLanguageFromEmail,
  getUserIdFromEmail,
  getUserIdFromRecoveryPasswordToken,
  sendNewConfirmationEmailAllIncluded,
  setRecoveryTokenToUsed,
  updateBasicUserInfoFromUserId,
  updateNewsLetterSubscription,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
  validateEmailIsUnique,
  getPrimaryPersonIdFromUserId,
  updatePrimaryPerson,
  useToken,
  sendPersonTransferEmailAllIncluded,
  isRegistered,
  getPeopleTransferedToUser,
  getPeopleTransferedToEmails,
  transferPerson,
  getTokenPromoCode,
  cancelPersonTransfer,
  declinePersonTransfer,
  getTransferInfosFromToken,
  getLanguageFromUser,
  getUserIdFromMessengerId,
  getUserIdFromAuthToken,
};
