const knex = require('../../db/connection');
const bcrypt = require('bcrypt');
const {
  sendConfirmationEmail,
  sendRecoveryEmail,
} = require('../utils/nodeMailer');
const { EXPIRATION_TIMES } = require('../../../../common/constants');
const {
  confirmEmail: confirmEmailHelper,
  createConfirmationEmailToken,
  generateHashedPassword,
  getBasicUserInfoFromId,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
  getUserIdFromAuthToken,
} = require('../../db/queries/user');

const {
  ENTITIES_ROLE_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  STATUS_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');
const {
  generateAuthToken,
  generateToken,
} = require('../../db/queries/utils');
const {
  createRecoveryEmailToken,
  createUserComplete,
  getEmailFromToken,
  getLanguageFromEmail,
  getUserIdFromRecoveryPasswordToken,
  setRecoveryTokenToUsed,
  validateEmailIsUnique,
} = require('../../db/queries/auth');

async function signup({
  firstName,
  lastName,
  email,
  password,
  redirectUrl,
  newsLetterSubscription,
}) {
  // Validate email is not already taken
  const isUnique = await validateEmailIsUnique(email);

  if (!isUnique) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }

  const hashedPassword = await generateHashedPassword(password);

  const confirmationEmailToken = generateToken();

  await createUserComplete({
    password: hashedPassword,
    email,
    name: firstName,
    surname: lastName,
    newsLetterSubscription,
  });
  await createConfirmationEmailToken({
    email,
    token: confirmationEmailToken,
  });
  const language = await getLanguageFromEmail(email);
  // Send confirmation email with link
  await sendConfirmationEmail({
    email,
    language,
    token: confirmationEmailToken,
    redirectUrl,
  });
  return { code: STATUS_ENUM.SUCCESS };
}

async function login({ email, password }) {
  // Validate account with this email exists
  const userId = await getUserIdFromEmail(email);
  if (!userId) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  // Validate email is confirmed
  const emailIsConfirmed = await validateEmailIsConfirmed(email);
  if (!emailIsConfirmed) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const hashedPassword = await getHashedPasswordFromId(userId);
  if (!hashedPassword) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const isSame = bcrypt.compareSync(password, hashedPassword);

  if (isSame) {
    const token = await generateAuthToken(userId);

    const userInfo = await getBasicUserInfoFromId(userId);

    return { token, userInfo };
  } else {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }
}

async function loginWithToken(token) {
  const userId = await getUserIdFromAuthToken(token);
  if (!userId) {
    return;
  }
  return getBasicUserInfoFromId(userId);
}

async function confirmEmail({ token }) {
  const email = await getEmailFromToken({ token });

  if (!email) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }

  await confirmEmailHelper({ email });

  const authToken = generateToken();
  const userId = await getUserIdFromEmail(email);

  await knex('user_token').insert({
    user_id: userId,
    token_id: authToken,
    expires_at: new Date(Date.now() + EXPIRATION_TIMES.AUTH_TOKEN),
  });

  const userInfo = await getBasicUserInfoFromId(userId);

  return { token: authToken, userInfo };
}

async function recoveryEmail({ email }) {
  const userId = await getUserIdFromEmail(email);

  if (!userId) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const token = generateToken();

  await createRecoveryEmailToken({ userId, token });
  const language = await getLanguageFromEmail(email);
  await sendRecoveryEmail({ email, token, language });

  return STATUS_ENUM.SUCCESS;
}

async function recoverPassword({ token, password }) {
  const userId = await getUserIdFromRecoveryPasswordToken(token);

  if (!userId) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }

  const hashedPassword = await generateHashedPassword(password);

  await updatePasswordFromUserId({ id: userId, hashedPassword });

  await setRecoveryTokenToUsed(token);

  const authToken = await generateAuthToken(userId);

  const userInfo = await getBasicUserInfoFromId(userId);

  return { authToken, userInfo };
}

async function resendConfirmationEmail({ email, successRoute }) {
  const isEmailConfirmed = await validateEmailIsConfirmed(email);

  if (isEmailConfirmed) {
    throw new Error(ERROR_ENUM.FORBIDDEN);
  }

  const token = generateToken();
  const language = await getLanguageFromEmail(email);

  await createConfirmationEmailToken({ email, token });

  await sendConfirmationEmail({
    email,
    language,
    token,
    successRoute,
  });

  return STATUS_ENUM.SUCCESS;
}

async function transferPersonSignup({ email, password, personId }) {
  const hashedPassword = await generateHashedPassword(password);
  const { token: authToken, user_id } = await knex.transaction(
    async trx => {
      // Create user
      const [user_id] = await knex('users')
        .insert({ password: hashedPassword })
        .returning('id')
        .transacting(trx);

      if (!user_id) {
        return;
      }

      // Create user email and confirm it right away
      await knex('user_email')
        .insert({ user_id, email, confirmed_email_at: new Date() })
        .transacting(trx);

      //Log the user
      const token = generateToken();
      await knex('user_token')
        .insert({
          user_id,
          token_id: token,
          expires_at: new Date(
            Date.now() + EXPIRATION_TIMES.AUTH_TOKEN,
          ),
        })
        .transacting(trx);
      //transfer the person
      await knex('user_entity_role')
        .update({ user_id })
        .where('entity_id', personId)
        .andWhere('role', ENTITIES_ROLE_ENUM.ADMIN)
        .returning('entity_id')
        .transacting(trx);
      await knex('transfered_person')
        .update('status', PERSON_TRANSFER_STATUS_ENUM.ACCEPTED)
        .where({ person_id: personId })
        .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING)
        .transacting(trx);

      //set person as primary person
      await knex('user_primary_person')
        .insert({
          user_id,
          primary_person: personId,
        })
        .transacting(trx);

      return { token, user_id };
    },
  );
  //get user infos
  const userInfo = await getBasicUserInfoFromId(user_id);
  return { authToken, userInfo };
}

module.exports = {
  confirmEmail,
  login,
  recoverPassword,
  recoveryEmail,
  resendConfirmationEmail,
  signup,
  transferPersonSignup,
  loginWithToken,
};
