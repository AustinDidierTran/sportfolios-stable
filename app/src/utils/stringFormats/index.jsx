import {
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums';
import _ from 'lodash';

import moment from 'moment';
import { formatRoute } from '../../actions/goTo';

export const getInitialsFromName = completeName => {
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
};

export const formatDate = (moment, format) => {
  moment.locale(localStorage.getItem('i18nextLng'));
  if (format) {
    return moment.format(format);
  }
  return moment.format('LL');
};

export const getEntityTypeName = type => {
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
};

export const getMembershipName = type => {
  if (type === MEMBERSHIP_TYPE_ENUM.RECREATIONAL) {
    return 'recreational_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.COMPETITIVE) {
    return 'competitive_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.ELITE) {
    return 'elite_member';
  } else {
    return '';
  }
};
export const getMembershipType = type => {
  if (type === -1) {
    return 'fixed_date';
  } else {
    return 'length';
  }
};

export const getMembershipLength = type => {
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
    return 1;
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
    return 6;
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
    return 1;
  }
};

export const getMembershipUnit = type => {
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
    return 'M';
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
    return 'M';
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
    return 'y';
  }
};

export const getExpirationDate = (length, fixed_date) => {
  if (length !== -1) {
    return formatDate(
      moment().add(
        getMembershipLength(length),
        getMembershipUnit(length),
      ),
    );
  } else {
    if (
      moment(fixed_date).set('year', moment().get('year')) < moment()
    ) {
      return formatDate(
        moment(fixed_date).set('year', moment().get('year') + 1),
      );
    } else {
      return formatDate(
        moment(fixed_date).set('year', moment().get('year')),
      );
    }
  }
};

export const formatPrice = price => `${price / 100} CAD`;

export const validateDate = dateProps => {
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
};

export const getFormattedMailTo = (emails, subject, body) => {
  if (!emails) {
    throw 'No email is provided';
  }

  if (!_.isArray(emails)) {
    throw 'Emails should be an array';
  }

  if (!emails.length) {
    throw 'No email is provided';
  }

  const formattedEmails = emails.join(', ');

  const queryParams = {};

  if (subject) {
    queryParams.subject = encodeURIComponent(subject);
  }

  if (body) {
    queryParams.body = encodeURIComponent(body);
  }

  return formatRoute(`mailTo:${formattedEmails}`, null, queryParams);
};
