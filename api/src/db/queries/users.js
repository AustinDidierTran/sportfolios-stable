const bcrypt = require('bcrypt');

const {
  createUserEmail,
  generateHashedPassword,
  getBasicUserInfoFromId,
  getEmailsFromAuthToken,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  getUserIdFromToken,
  sendNewConfirmationEmailAllIncluded,
  updateBasicUserInfoFromUserId,
  updatePasswordFromUserId,
} = require('../helpers');

const addEmail = async (user_id, { email }) => {
  if (!user_id) {
    return 402;
  }

  // validate there is no user with said email
  const email_user_id = await getUserIdFromEmail(email);

  if (email_user_id) {
    return 403;
  }

  await createUserEmail({ user_id, email });

  await sendNewConfirmationEmailAllIncluded(email);

  return 200;
};

const changePassword = async (
  user_id,
  { oldPassword, newPassword },
) => {
  if (
    !newPassword ||
    newPassword.length < 8 ||
    newPassword.length > 40
  ) {
    return 404;
  }

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

  await updatePasswordFromUserId({
    id: user_id,
    hashedPassword: newHashedPassword,
  });

  return 200;
};

const changeUserInfo = async ({
  authToken,
  firstName,
  language,
  lastName,
}) => {
  const user_id = await getUserIdFromToken(authToken);

  if (!user_id) {
    return 402;
  }

  await updateBasicUserInfoFromUserId({
    user_id,
    firstName,
    language,
    lastName,
  });

  return 200;
};

const getEmails = async ({ authToken }) => {
  const emails = await getEmailsFromAuthToken(authToken);

  if (!emails) {
    return { status: 403 };
  }

  return { status: 200, emails };
};

const userInfo = async id => {
  const basicUserInfo = await getBasicUserInfoFromId(id);

  if (!basicUserInfo) {
    return { status: 403 };
  }
  // get basic user info
  return { basicUserInfo, status: 200 };
};

module.exports = {
  addEmail,
  changePassword,
  changeUserInfo,
  getEmails,
  userInfo,
};
