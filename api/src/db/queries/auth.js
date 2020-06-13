const knex = require('../connection');
const bcrypt = require('bcrypt');
const {
  sendConfirmationEmail,
  sendRecoveryEmail,
} = require('../../server/utils/nodeMailer');
const {
  confirmEmail: confirmEmailHelper,
  createUser,
  createUserEmail,
  createUserInfo,
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
} = require('../helpers');

const signup = async ({ firstName, lastName, email, password }) => {
  console.log('firstName', firstName);
  console.log('lastName', lastName);
  console.log('email', email);
  console.log('password', password);

  // Validate email is not already taken
  const isUnique = await validateEmailIsUnique(email);

  if (!isUnique) return { code: 403 };

  if (!password || password.length < 8 || password.length > 40) {
    return { code: 402 };
  }

  const hashedPassword = await generateHashedPassword(password);

  const confirmationEmailToken = generateToken();

  const user = await createUser(hashedPassword);

  console.log('creating user email');

  await createUserEmail({ user_id: user.id, email });

  console.log('creating user info');

  await createUserInfo({
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
  });

  console.log('creating confirmation email token');

  await createConfirmationEmailToken({
    email,
    token: confirmationEmailToken,
  });

  console.log('sending confirmation email');

  // Send confirmation email with link
  await sendConfirmationEmail({
    email,
    token: confirmationEmailToken,
  });

  return { code: 200 };
};

const login = async ({ email, password }) => {
  // Validate account with this email exists
  const user_id = await getUserIdFromEmail(email);

  if (!user_id) {
    return { status: 404 };
  }

  // Validate email is confirmed
  const emailIsConfirmed = await validateEmailIsConfirmed(email);
  if (!emailIsConfirmed) {
    return { status: 401 };
  }

  const hashedPassword = await getHashedPasswordFromId(user_id);
  if (!hashedPassword) {
    return { status: 402 };
  }

  const isSame = bcrypt.compareSync(password, hashedPassword);

  if (isSame) {
    const token = generateToken();
    await knex('user_token').insert({
      user_id: user_id,
      token_id: token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const userInfo = await getBasicUserInfoFromId(user_id);

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

  return 200;
};

const recoveryEmail = async ({ email }) => {
  const user_id = await getUserIdFromEmail({ email });

  if (!user_id) {
    return 404;
  }

  const token = generateToken();

  await createRecoveryEmailToken({ user_id, token });

  await sendRecoveryEmail({ email, token });

  return 200;
};

const recoverPassword = async ({ token, password }) => {
  const userId = await getUserIdFromRecoveryPasswordToken(token);

  if (!userId) {
    return 403;
  }

  const hashedPassword = await generateHashedPassword(password);

  await updatePasswordFromUserId({ id: userId, hashedPassword });

  await setRecoveryTokenToUsed(token);

  return 200;
};

const resendConfirmationEmail = async ({ email }) => {
  const isEmailConfirmed = await validateEmailIsConfirmed(email);

  if (isEmailConfirmed) {
    return 403;
  }

  const token = generateToken();

  await createConfirmationEmailToken({ email, token });

  await sendConfirmationEmail({ email, token });

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
