import {
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums';

import moment from 'moment';

export function getInitialsFromName(completeName) {
  return (
    completeName &&
    completeName
      .split(/(?:-| )+/)
      .reduce(
        (prev, curr, index) =>
          index <= 2 ? `${prev}${curr[0]}` : prev,
        '',
      )
      .toUpperCase()
  );
}

export function getEntityTypeName(type) {
  if (type === GLOBAL_ENUM.PERSON) {
    return 'person';
  } else if (type === GLOBAL_ENUM.TEAM) {
    return 'team';
  } else if (type === GLOBAL_ENUM.ORGANIZATION) {
    return 'organization';
  } else if (type === GLOBAL_ENUM.EVENT) {
    return 'event';
  } else {
    return '';
  }
}

export function getMembershipName(type) {
  if (type === MEMBERSHIP_TYPE_ENUM.RECREATIONAL) {
    return 'recreational_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.COMPETITIVE) {
    return 'competitive_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.ELITE) {
    return 'elite_member';
  } else {
    return '';
  }
}
export function getMembershipType(type) {
  if (type === -1) {
    return 'fixed_date';
  } else {
    return 'length';
  }
}

export function getMembershipLength(type) {
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
    return 1;
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
    return 6;
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
    return 1;
  }
}

export function getMembershipUnit(type) {
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
    return 'M';
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
    return 'M';
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
    return 'y';
  }
}

export function getExpirationDate(length, fixed_date) {
  if (length !== -1) {
    return moment()
      .add(getMembershipLength(length), getMembershipUnit(length))
      .format('LL');
  } else {
    if (
      moment(fixed_date).set('year', moment().get('year')) < moment()
    ) {
      return moment(fixed_date)
        .set('year', moment().get('year') + 1)
        .format('LL');
    } else {
      return moment(fixed_date)
        .set('year', moment().get('year'))
        .format('LL');
    }
  }
}

export function validateDate(dateProps) {
  //date format: 'MM/DD'
  const days = [31, 28, 31, 30, 31, 30, 31, 30, 31, 31, 30, 31];
  const date = dateProps.split('/');
  const month = Number(date[0]);
  const day = Number(date[1]);
  if (month < 1 || month > 12 || isNaN(month) || month === null) {
    return false;
  } else if (
    day > days[month - 1] ||
    day < 1 ||
    isNaN(day) ||
    day === null
  ) {
    return false;
  }
  return true;
}
