const knex = require('../connection');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');
const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
} = require('../../../../common/enums');

const { EXPIRATION_TIMES } = require('../../../../common/constants');

const {
  sendConfirmationEmail,
  sendPersonTransferEmail,
} = require('../../server/utils/nodeMailer');
const { ERROR_ENUM } = require('../../../../common/errors');

const confirmEmail = async ({ email }) => {
  await knex('user_email')
    .update('confirmed_email_at', new Date())
    .where({ email });
};

const createUserEmail = async body => {
  const { user_id, email } = body;

  await knex('user_email').insert({ user_id, email });
};

const createUserComplete = async body => {
  const { password, email, name, surname } = body;

  await knex.transaction(async trx => {
    // Create user
    const [user_id] = await knex('users')
      .insert({ password })
      .returning('id')
      .transacting(trx);

    // Create user email
    await knex('user_email')
      .insert({ user_id, email })
      .transacting(trx);

    // Create user info
    const [entity_id] = await knex('entities')
      .insert({
        type: GLOBAL_ENUM.PERSON,
      })
      .returning('id')
      .transacting(trx);

    await knex('entities_name')
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
  person_id,
  token,
  sender_id,
}) => {
  return knex('transfered_person')
    .insert({
      email,
      token,
      person_id,
      sender_id,
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

const generateAuthToken = async userId => {
  const token = generateToken();
  await knex('user_token').insert({
    user_id: userId,
    token_id: token,
    expires_at: new Date(Date.now() + EXPIRATION_TIMES.AUTH_TOKEN),
  });
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
      'entities_name',
      'user_entity_role.entity_id',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'entities_photo',
      'user_entity_role.entity_id',
      '=',
      'entities_photo.entity_id',
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
      'entities_name',
      'user_entity_role.entity_id',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'entities_photo',
      'user_entity_role.entity_id',
      '=',
      'entities_photo.entity_id',
    )
    .where('entities.type', GLOBAL_ENUM.PERSON)
    .andWhere({ user_id });
  return {
    primaryPerson,
    persons,
    app_role,
    language,
    user_id,
  };
};

const getEmailsFromUserId = async userId => {
  if (!userId) {
    return [];
  }

  const emails = await knex('user_email')
    .select(['email', 'confirmed_email_at'])
    .where({ user_id: userId });

  return emails;
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

const getUserIdFromEmail = async body => {
  const { email } = body;

  const [{ user_id } = {}] = await knex('user_email')
    .select(['user_id'])
    .where({ email });

  return user_id;
};

const getLanguageFromEmail = async email => {
  const id = await getUserIdFromEmail({ email });
  if (!id) {
    return;
  }
  const infos = await getBasicUserInfoFromId(id);
  return infos.language;
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

const setRecoveryTokenToUsed = async token => {
  await knex('recovery_email_token')
    .update({ used_at: new Date() })
    .where({ token });
};

const updateBasicUserInfoFromUserId = async ({
  user_id,
  language,
}) => {
  const update = {};

  if (language) {
    update.language = language;
  }

  await knex('users')
    .update(update)
    .where({ id: user_id });
};

const updatePasswordFromUserId = async ({ hashedPassword, id }) => {
  await knex('users')
    .update({ password: hashedPassword })
    .where({ id });
};

const updatePrimaryPerson = async (user_id, primary_person) => {
  return knex('user_primary_person')
    .update({ primary_person })
    .where({ user_id })
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
    person_id: sendedPersonId,
    sender_id: senderUserId,
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

const transferPerson = async (person_id, user_id) => {
  return knex.transaction(async trx => {
    const id = await knex('user_entity_role')
      .update({ user_id })
      .where('entity_id', person_id)
      .andWhere('role', ENTITIES_ROLE_ENUM.ADMIN)
      .returning('entity_id')
      .transacting(trx);

    await knex('transfered_person')
      .update('status', PERSON_TRANSFER_STATUS_ENUM.ACCEPTED)
      .where({ person_id })
      .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
      .transacting(trx);
    return id;
  });
};

const cancelPersonTransfer = async person_id => {
  const [person] = await knex('transfered_person')
    .where({ person_id })
    .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
    .update('status', PERSON_TRANSFER_STATUS_ENUM.CANCELED)
    .returning('person_id');
  return person;
};

const declinePersonTransfer = async person_id => {
  const [person] = await knex('transfered_person')
    .where({ person_id })
    .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
    .update('status', PERSON_TRANSFER_STATUS_ENUM.REFUSED)
    .returning('person_id');
  return person;
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
  getBasicUserInfoFromId,
  getEmailFromToken,
  getEmailsFromUserId,
  getHashedPasswordFromId,
  getLanguageFromEmail,
  getUserIdFromEmail,
  getUserIdFromRecoveryPasswordToken,
  sendNewConfirmationEmailAllIncluded,
  setRecoveryTokenToUsed,
  updateBasicUserInfoFromUserId,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
  validateEmailIsUnique,
  getPrimaryPersonIdFromUserId,
  updatePrimaryPerson,
  sendPersonTransferEmailAllIncluded,
  getPeopleTransferedToUser,
  getPeopleTransferedToEmails,
  transferPerson,
  cancelPersonTransfer,
  declinePersonTransfer,
};
