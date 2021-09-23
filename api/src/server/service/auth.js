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
  updateCognitoIdUser,
} from '../../db/queries/auth.js';

import AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { USER_POOL_ID, CLIENT_ID } from '../../../../conf.js';
import userPool from '../utils/Cognito/UserPool.js';

import { INDENTITY_POOL_ID, REGION } from '../../../../conf.js';
import Amplify from 'aws-amplify';
import { getCognitoidentityserviceprovider } from '../utils/aws.js'
import * as jwt from "jsonwebtoken";
import * as jwkToPem from 'jwk-to-pem';
import aws from 'aws-sdk';

Amplify.default.configure({
  Auth: {
    region: REGION,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: CLIENT_ID,
  },
});

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

export const signupAmplify = async ({
  firstName,
  lastName,
  email,
  password,
  redirectUrl,
  newsLetterSubscription,
}) => {

  try {
    const { user } = await Amplify.Auth.signUp({
      username: email,
      password: password,

    });
    if (user) {
      await createUserComplete({
        password: ' ',
        email,
        name: firstName,
        surname: lastName,
        newsLetterSubscription,
        idUser: data.userSub
      });
      return STATUS_ENUM.SUCCESS;
    }
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

export const loginAmplify = async ({ email, password }) => {
  try {
    const user = await Amplify.Auth.signIn(email, password);
    const token = user.signInUserSession.idToken.jwtToken;
    const userId = await getUserIdFromEmail(user.attributes.email);
    const userInfo = await getBasicUserInfoFromId(userId);
    var jwk = aws.getJwkFromAWS();
    var pem = jwkToPem(jwk);
    jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err, decodedToken) {
    });

    return { token, userInfo };
  } catch (error) {
    console.log('error signing in', error);
    if (error.code === 'NotAuthorizedException') {

      const res = await login({ email, password })
      //var cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();
      if (res) {
        //Create the user with AdminCreateUser()
        const params = {
          UserPoolId: USER_POOL_ID,
          Username: email,
          MessageAction: 'SUPPRESS', //suppress the sending of an invitation to the user
          TemporaryPassword: password,
          UserAttributes: [
            { Name: 'email', Value: email }, //using sign-in with email, so username is email
            { Name: 'email_verified', Value: 'true' }]
        };
        var cognitoidentityserviceprovider = await getCognitoidentityserviceprovider();
        cognitoidentityserviceprovider.adminCreateUser(params, function (err, data) {
          if (err) {
            console.log('Failed to Create migrating user in User Pool: ' + email);
            console.log(err)
            callback(err);
            return;
          } else {
            //Successfully created the migrating user in the User Pool
            console.log("Successful AdminCreateUser for migrating user: " + email);
          }
        })
      }
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

export const confirmAccountAmplify = async ({ email, code }) => {
  try {
    await Amplify.Auth.confirmSignUp(email, code);
    return STATUS_ENUM.SUCCESS;
  } catch (error) {
    console.log('error confirming sign up', error);
  }
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

export const resendConfirmationEmailAmplify = async ({ email }) => {
  try {
    await Amplify.Auth.resendSignUp(email);
    return STATUS_ENUM.SUCCESS;
  } catch (error) {
    console.log('error resend Confirmation Email Amplify:', error);
  }
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
