const { MEMBERSHIP_TYPE_ENUM } = require('../enums');

const getMembershipName = type => {
  if (type === MEMBERSHIP_TYPE_ENUM.RECREATIONAL) {
    return 'recreational_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.COMPETITIVE) {
    return 'competitive_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.ELITE) {
    return 'elite_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.JUNIOR) {
    return 'junior_member';
  } else {
    return '';
  }
};

module.exports = {
  getMembershipName,
};
