const bcrypt = require('bcrypt');
const {
  generateHashedPassword,
  getBasicUserInfoFromToken,
  getEmailsFromAuthToken,
  getHashedPasswordFromId,
  getUserIdFromToken,
  updateBasicUserInfoFromUserId,
  updatePasswordFromUserId,
} = require('../helpers');

const changePassword = async ({ authToken, oldPassword, newPassword }) => {
  const user_id = await getUserIdFromToken(authToken);

  if (!oldPassword || oldPassword.length < 8 || oldPassword.length > 16) {
    return 404;
  }

  if (!newPassword || newPassword.length < 8 || newPassword.length > 16) {
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

  await updatePasswordFromUserId({ id: user_id, hashedPassword: newHashedPassword })

  return 200;
}


const changeUserInfo = async ({ authToken, firstName, language, lastName }) => {
  const user_id = await getUserIdFromToken(authToken);

  if (!user_id) {
    return 402;
  }

  await updateBasicUserInfoFromUserId({
    user_id,
    firstName,
    language,
    lastName
  });

  return 200;
}

const getEmails = async ({ authToken }) => {
  const emails = await getEmailsFromAuthToken(authToken);

  if (!emails) {
    return { status: 403 };
  }

  return { status: 200, emails };
}

const userInfo = async ({ authToken }) => {
  const basicUserInfo = await getBasicUserInfoFromToken(authToken);

  if (!basicUserInfo) {
    return { status: 403 }
  }
  // get basic user info
  return { basicUserInfo, status: 200 };
}

module.exports = {
  changePassword,
  changeUserInfo,
  getEmails,
  userInfo,
}