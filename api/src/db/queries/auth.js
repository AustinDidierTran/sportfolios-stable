const knex = require('../connection');
const bcrypt = require('bcrypt');
const {
  sendConfirmationEmail,
  sendRecoveryEmail,
} = require('../../server/utils/nodeMailer');
const {
  confirmEmail: confirmEmailHelper,
  createUserComplete,
  createConfirmationEmailToken,
  createRecoveryEmailToken,
  generateHashedPassword,
  generateToken,
  getBasicUserInfoFromId,
  getEmailFromToken,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  getUserIdFromRecoveryPasswordToken,
  setRecoveryTokenToUsed,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
  validateEmailIsUnique,
  generateAuthToken,
} = require('../helpers');

const signup = async ({
  firstName,
  lastName,
  email,
  password,
  successRoute,
}) => {
  // Validate email is not already taken
  const isUnique = await validateEmailIsUnique(email);

  if (!isUnique) return { code: 403 };

  if (!password || password.length < 8 || password.length > 40) {
    return { code: 402 };
  }

  const hashedPassword = await generateHashedPassword(password);

  const confirmationEmailToken = generateToken();

  await createUserComplete({
    password: hashedPassword,
    email,
    name: firstName,
    surname: lastName,
  });

  await createConfirmationEmailToken({
    email,
    token: confirmationEmailToken,
  });

  // Send confirmation email with link
  await sendConfirmationEmail({
    email,
    token: confirmationEmailToken,
    successRoute,
  });
  return { code: 200 };
};

const login = async ({ email, password }) => {
  // Validate account with this email exists
  const userId = await getUserIdFromEmail({ email });
  if (!userId) {
    return { status: 404 };
  }

  // Validate email is confirmed
  const emailIsConfirmed = await validateEmailIsConfirmed(email);
  if (!emailIsConfirmed) {
    return { status: 401 };
  }

  const hashedPassword = await getHashedPasswordFromId(userId);
  if (!hashedPassword) {
    return { status: 402 };
  }

  const isSame = bcrypt.compareSync(password, hashedPassword);

  if (isSame) {
    const token = await generateAuthToken(userId);

    const userInfo = await getBasicUserInfoFromId(userId);

    return { status: 200, token, userInfo };
  } else {
    return { status: 403 };
  }
};

const confirmEmail = async ({ token }) => {
  const email = await getEmailFromToken({ token });

  if (!email) {
    // Email not found or token is expired
    return 403;
  }

  await confirmEmailHelper({ email });

  const authToken = generateToken();
  const userId = await getUserIdFromEmail({ email });

  await knex('user_token').insert({
    user_id: userId,
    token_id: authToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const userInfo = await getBasicUserInfoFromId(userId);

  return { status: 200, token: authToken, userInfo };
};

const recoveryEmail = async ({ email }) => {
  const userId = await getUserIdFromEmail({ email });

  if (!userId) {
    return 404;
  }

  const token = generateToken();

  await createRecoveryEmailToken({ userId, token });

  await sendRecoveryEmail({ email, token });

  return 200;
};

const recoverPassword = async ({ token, password }) => {
  const userId = await getUserIdFromRecoveryPasswordToken(token);

  if (!userId) {
    return { code: 403 };
  }

  const hashedPassword = await generateHashedPassword(password);

  await updatePasswordFromUserId({ id: userId, hashedPassword });

  await setRecoveryTokenToUsed(token);

  const authToken = await generateAuthToken(userId);

  const userInfo = await getBasicUserInfoFromId(userId);

  return { code: 200, authToken, userInfo };
};

const resendConfirmationEmail = async ({ email, successRoute }) => {
  const isEmailConfirmed = await validateEmailIsConfirmed(email);

  if (isEmailConfirmed) {
    return 403;
  }

  const token = generateToken();

  await createConfirmationEmailToken({ email, token });

  await sendConfirmationEmail({ email, token, successRoute });

  return 200;
};

module.exports = {
  confirmEmail,
  login,
  recoverPassword,
  recoveryEmail,
  resendConfirmationEmail,
  signup,
};
