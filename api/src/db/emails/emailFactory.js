const AddeddToRoster = require('./addedToRoster');
const { NOTIFICATION_TYPE } = require('./../../../../common/enums');

const map = {
  [NOTIFICATION_TYPE.ADDED_TO_ROSTER]: AddeddToRoster,
};

module.exports = async function EmailFactory(infos) {
  const { type, ...otherInfos } = infos;
  const email = map[type];
  return await email(otherInfos);
};
