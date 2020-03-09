const knex = require('../connection');
const bcrypt = require('bcrypt');
const { sendConfirmationEmail, sendRecoveryEmail } = require('../../server/utils/nodeMailer');
const {
  confirmEmail,
  createUser,
  createUserEmail,
  createUserInfo,
  createConfirmationEmailToken,
  createRecoveryEmailToken,
  generateHashedPassword,
  generateToken,
  getEmailFromToken,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  getUserIdFromRecoveryPasswordToken,
  getUserIdFromToken,
  setRecoveryTokenToUsed,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
  validateEmailIsUnique,
} = require('../helpers');

const signup = async ({ firstName, lastName, email, password }) => {
  // Validate email is not already taken
  const isUnique = validateEmailIsUnique(email);

  if (!isUnique) return { code: 403 };

  const hashedPassword = await generateHashedPassword(password)

  const confirmationEmailToken = generateToken();

  const user = await createUser(hashedPassword);

  await createUserEmail({ user_id: user.id, email });

  await createUserInfo({
    user_id: user.id,
    first_name: firstName,
    last_name: lastName
  });

  await createConfirmationEmailToken({
    email,
    token: confirmationEmailToken,
  });

  // Send confirmation email with link
  await sendConfirmationEmail({
    email,
    token: confirmationEmailToken,
  });

  return { code: 200 };
};

const login = async ({ email, password }) => {
  // Validate email is confirmed
  const emailIsConfirmed = await validateEmailIsConfirmed(email);

  if (!emailIsConfirmed) {
    return { status: 401 };
  }

  const user_id = await getUserIdFromEmail(email);

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

    return { status: 200, token };
  } else {
    return { status: 403 };
  }
};

const confirmEmailRoute = async ({ token }) => {
  const email = await getEmailFromToken({ token });

  if (!email) {
    // Email not found or token is expired
    return 403;
  }

  await confirmEmail({ email });

  return 200;
}

const recoveryEmail = async ({ email }) => {
  const user_id = await getUserIdFromEmail({ email });

  if (!user_id) {
    return 404;
  }

  const token = generateToken();

  await createRecoveryEmailToken({ user_id, token })

  await sendRecoveryEmail({ email, token });

  return 200;
}

const recoverPassword = async ({ token, password }) => {
  const userId = await getUserIdFromRecoveryPasswordToken(token);

  if (!userId) {
    return 403;
  }

  const hashedPassword = await generateHashedPassword(password);

  await updatePasswordFromUserId({ id: userId, hashedPassword });

  await setRecoveryTokenToUsed(token);

  return 200;
}

const resendConfirmationEmail = async ({ email }) => {
  const isEmailConfirmed = await validateEmailIsConfirmed(email);

  if (isEmailConfirmed) {
    return 403;
  }

  const token = generateToken();

  await createConfirmationEmailToken({ email, token });

  await sendConfirmationEmail({ email, token, });

  return 200;
}

const changePassword = async ({ authToken, oldPassword, newPassword }) => {
  const user_id = await getUserIdFromToken(authToken);

  if (!user_id) {
    return 402;
  }

  const oldHashedPassword = await getHashedPasswordFromId(user_id);

  if (!oldHashedPassword) {
    return 404;
  }

  const isSame = bcrypt.compareSync(oldPassword, oldHashedPassword);

  if (!isSame) {
    return 403;
  }

  const newHashedPassword = await generateHashedPassword(newPassword);

  await updatePasswordFromUserId({ id: user_id, hashedPassword: newHashedPassword })

  return 200;
}

const userInfo = async ({ authToken }) => {

}

module.exports = {
  signup,
  login,
  confirmEmail: confirmEmailRoute,
  recoveryEmail,
  recoverPassword,
  resendConfirmationEmail,
  changePassword,
  userInfo
}