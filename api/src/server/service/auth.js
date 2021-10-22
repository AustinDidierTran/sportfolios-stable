import knex from '../../db/connection.js';
import bcrypt from 'bcrypt';
import {
  sendConfirmationEmail,
  sendRecoveryEmail,
} from '../utils/nodeMailer.js';
import { EXPIRATION_TIMES } from '../../../../common/constants/index.js';

import {
  confirmEmail as confirmEmailHelper,
  createConfirmationEmailToken,
  generateHashedPassword,
  getBasicUserInfoFromId,
  getHashedPasswordFromId,
  getLanguageFromEmail,
  getUserIdFromEmail,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
} from '../../db/queries/user.js';

import {
  ENTITIES_ROLE_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import {
  generateAuthToken,
  generateToken,
} from '../../db/queries/utils.js';

import {
  createRecoveryEmailToken,
  createUserComplete,
  getEmailFromToken,
  getUserIdFromRecoveryPasswordToken,
  setRecoveryTokenToUsed,
  validateEmailIsUnique,
  getUserIdFromAuthToken,
} from '../../db/queries/auth.js';

import { validateToken } from '../utils/tokenValidation.js';
import { adminGetUser, adminCreateUser } from '../utils/aws.js';

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
    throw new Error(ERROR_ENUM.INVALID_EMAIL);
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
  return { confirmationEmailToken };
}

export const signupCognito = async ({
  firstName,
  lastName,
  email,
  newsLetterSubscription,
}) => {

  try {

    const data = await adminGetUser(email);
    const isUnique = await validateEmailIsUnique(email);

    if (!isUnique || !data) {
      throw new Error(ERROR_ENUM.INVALID_EMAIL);
    }

    await createUserComplete({
      password: ' ',
      email,
      name: firstName,
      surname: lastName,
      newsLetterSubscription,
      idUser: data.Username
    });
    return STATUS_ENUM.SUCCESS;
  } catch (error) {
    console.log('error signing up:', error);
  }


}

async function login({ email, password }) {
  // Validate account with this email exists
  const userId = await getUserIdFromEmail(email);

  if (!userId) {
    throw new Error(ERROR_ENUM.INVALID_EMAIL);
  }

  // Validate email is confirmed
  const emailIsConfirmed = await validateEmailIsConfirmed(email);

  if (!emailIsConfirmed) {
    throw new Error(ERROR_ENUM.UNCONFIRMED_EMAIL);
  }

  const hashedPassword = await getHashedPasswordFromId(userId);

  if (!hashedPassword) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  const isSame = bcrypt.compareSync(password, hashedPassword);

  if (isSame) {
    const token = await generateAuthToken(userId);

    const userInfo = await getBasicUserInfoFromId(userId);

    return { token, userInfo };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
}

async function loginWithToken(token) {
  const userId = await getUserIdFromAuthToken(token);
  if (!userId) {
    return;
  }
  return getBasicUserInfoFromId(userId);
}

export const loginCognito = async ({ email, token }) => {
  try {
    const decodedToken = await validateToken(token);
    if (!decodedToken.email || (decodedToken.email !== email)) {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }
    const userId = await getUserIdFromEmail(email);
    const userInfo = await getBasicUserInfoFromId(userId);
    return { userInfo };
  } catch (error) {
    if (error.name === ERROR_ENUM.JWT_EXPIRED) {
      throw new Error(ERROR_ENUM.JWT_EXPIRED);
    }
    if (error.name === ERROR_ENUM.JWT_INVALID) {
      throw new Error(ERROR_ENUM.JWT_INVALID);
    }

    console.log('error signing in', error);
    throw new Error(ERROR_ENUM.ERROR_OCCURED);

  }
}

export const migrateToCognito = async ({ email, password }) => {
  try {
    try {
      const isUnique = await adminGetUser(email);
      if (isUnique) {
        throw new Error(ERROR_ENUM.INVALID_EMAIL);
      }
    }
    catch (err) {
      if (err.code !== ERROR_ENUM.USER_NOT_FOUND) {
        throw new Error(ERROR_ENUM.ERROR_OCCURED);
      }
    };

    const user = await login({ email, password })
    if (user) {
      const res = await adminCreateUser(email, password);
      console.log('res: ', res);

      return STATUS_ENUM.SUCCESS;
    }
  } catch (error) {
    if (error.name === ERROR_ENUM.JWT_EXPIRED) {
      throw new Error(ERROR_ENUM.JWT_EXPIRED);
    }
    else {
      console.log('error signing in', error);
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }

  }
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

export const validEmail = async ({ email }) => {
  // Validate email is not already taken
  return await validateEmailIsUnique(email);
}

export {
  confirmEmail,
  login,
  recoverPassword,
  recoveryEmail,
  resendConfirmationEmail,
  signup,
  transferPersonSignup,
  loginWithToken,
};
