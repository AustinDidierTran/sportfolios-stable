const knex = require('../connection');
const bcrypt = require('bcrypt');
const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  COUPON_CODE_ENUM,
} = require('../../../../common/enums');

const { EXPIRATION_TIMES } = require('../../../../common/constants');
const {
  sendConfirmationEmail,
  sendPersonTransferEmail,
} = require('../../server/utils/nodeMailer');
const { ERROR_ENUM } = require('../../../../common/errors');
const randtoken = require('rand-token');
const { generateToken } = require('./utils');
const { getLanguageFromEmail } = require('./auth');

async function confirmEmail({ email }) {
  await knex('user_email')
    .update('confirmed_email_at', new Date())
    .where({ email });
}

async function getEmailUser(userId) {
  const [{ email }] = await knex('user_email')
    .select('email')
    .where({ user_id: userId });
  return email;
}

async function createUserEmail(body) {
  const { userId, email } = body;

  await knex('user_email').insert({ user_id: userId, email });
}

async function createConfirmationEmailToken({ email, token }) {
  await knex('confirmation_email_token').insert({
    email,
    token: token,
    expires_at: new Date(
      Date.now() + EXPIRATION_TIMES.EMAIL_CONFIRMATION_TOKEN,
    ),
  });
}

async function createPersonTransferToken({
  email,
  personId,
  token,
  senderId,
}) {
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
}

async function generateHashedPassword(password) {
  if (!password) {
    throw new Error(ERROR_ENUM.VALUE_IS_REQUIRED);
  }
  if (password.length < 8 || password.length > 24) {
    throw new Error(ERROR_ENUM.VALUE_IS_INVALID);
  }
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

function generatePromoCodeToken() {
  return randtoken.generate(6);
}

async function generateMemberImportToken(
  organizationId,
  expirationDate,
  membershipType,
  email,
) {
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
}

async function getBasicUserInfoFromId(user_id) {
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
}

async function isRegistered(personId, eventId) {
  const [res] = await knex('event_persons')
    .select('*')
    .where({ person_id: personId, event_id: eventId });
  return Boolean(res);
}

async function getEmailsFromUserId(userId) {
  if (!userId) {
    return [];
  }

  const emails = await knex('user_email')
    .select(['email', 'confirmed_email_at', 'is_subscribed'])
    .where({ user_id: userId });

  return emails;
}

async function getEmailFromUserId(userId) {
  if (!userId) {
    return [];
  }

  const [email] = await knex('user_email')
    .select(['email', 'confirmed_email_at', 'is_subscribed'])
    .where({ user_id: userId });

  return email;
}

async function getHashedPasswordFromId(id) {
  const [{ password } = {}] = await knex('users')
    .where({ id })
    .returning(['password']);

  return password;
}

async function getPrimaryPersonIdFromUserId(user_id) {
  const [{ primary_person: id }] = await knex('user_primary_person')
    .select('primary_person')
    .where({ user_id });
  return id;
}

async function getUserIdFromEmail(email) {
  const [{ user_id } = {}] = await knex('user_email')
    .select(['user_id'])
    .where({ email });
  return user_id;
}

async function getLanguageFromUser(id) {
  return (
    await knex('users')
      .select('language')
      .first()
      .where({ id })
  ).language;
}

async function getUserIdFromMessengerId(messenger_id) {
  const [res] = await knex('user_apps_id')
    .where({ messenger_id })
    .select('user_id');
  if (res) {
    return res.user_id;
  }
}

async function updateBasicUserInfoFromUserId({ userId, language }) {
  await knex('users')
    .update({ language })
    .where({ id: userId });
}

async function updatePasswordFromUserId({ hashedPassword, id }) {
  await knex('users')
    .update({ password: hashedPassword })
    .where({ id });
}

async function updatePrimaryPerson(userId, primary_person) {
  return knex('user_primary_person')
    .update({ primary_person })
    .where({ user_id: userId })
    .returning('*');
}

async function updateNewsLetterSubscription(userId, body) {
  const { email, subscription } = body;
  const [res] = await knex('user_email')
    .update({ is_subscribed: subscription })
    .where({ user_id: userId, email: email })
    .returning('*');
  return res;
}

async function useToken(tokenId) {
  return knex('token_promo_code')
    .update({ used: true })
    .where({ token_id: tokenId })
    .returning('*');
}

async function validateEmailIsConfirmed(email) {
  const response = await knex('user_email')
    .where({ email })
    .returning(['confirmed_email_at']);

  return response.length && response[0].confirmed_email_at !== null;
}

async function sendNewConfirmationEmailAllIncluded(
  email,
  successRoute,
) {
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
}

async function sendPersonTransferEmailAllIncluded({
  email,
  sendedPersonId,
  senderUserId,
}) {
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
}

async function getPeopleTransferedToUser(userId) {
  const emailsAndConfirmed = await getEmailsFromUserId(userId);
  const emails = emailsAndConfirmed
    .filter(email => email.confirmed_email_at)
    .map(email => email.email);
  return getPeopleTransferedToEmails(emails);
}

async function getPeopleTransferedToEmails(emails) {
  const peopleId = knex
    .select('person_id')
    .from('transfered_person')
    .whereIn('email', emails)
    .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING);
  return knex('person_all_infos')
    .select('*')
    .whereIn('id', peopleId);
}

async function transferPerson(personId, userId) {
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
}

async function getTokenPromoCode(tokenId) {
  const [res] = await knex('token_promo_code')
    .select('*')
    .where({
      token_id: tokenId,
    });
  return res;
}

async function cancelPersonTransfer(personId) {
  const [person] = await knex('transfered_person')
    .where({ person_id: personId })
    .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
    .update('status', PERSON_TRANSFER_STATUS_ENUM.CANCELED)
    .returning('person_id');
  return person;
}

async function declinePersonTransfer(personId) {
  const [person] = await knex('transfered_person')
    .where({ person_id: personId })
    .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
    .update('status', PERSON_TRANSFER_STATUS_ENUM.REFUSED)
    .returning('person_id');
  return person;
}

async function getTransferInfosFromToken(token) {
  return knex('transfered_person')
    .select('*')
    .where({ token })
    .first();
}

module.exports = {
  cancelPersonTransfer,
  confirmEmail,
  createConfirmationEmailToken,
  createUserEmail,
  declinePersonTransfer,
  generateHashedPassword,
  generateMemberImportToken,
  getBasicUserInfoFromId,
  getEmailFromUserId,
  getEmailsFromUserId,
  getEmailUser,
  getHashedPasswordFromId,
  getLanguageFromUser,
  getPeopleTransferedToEmails,
  getPeopleTransferedToUser,
  getPrimaryPersonIdFromUserId,
  getTokenPromoCode,
  getTransferInfosFromToken,
  getUserIdFromEmail,
  getUserIdFromMessengerId,
  isRegistered,
  sendNewConfirmationEmailAllIncluded,
  sendPersonTransferEmailAllIncluded,
  transferPerson,
  updateBasicUserInfoFromUserId,
  updateNewsLetterSubscription,
  updatePasswordFromUserId,
  updatePrimaryPerson,
  useToken,
  validateEmailIsConfirmed,
};
