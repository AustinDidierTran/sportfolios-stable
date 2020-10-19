import {
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  GLOBAL_ENUM,
} from '../../../../common/enums';
import isArray from 'lodash/isArray';

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

export const formatDate = (moment, format = 'LL') => {
  moment.locale(localStorage.getItem('i18nextLng'));
  return moment.format(format);
};

export const formatIntervalDate = (start, end) => {
  let word = 'to';
  if (localStorage.getItem('i18nextLng') === 'fr') {
    word = 'au';
  }

  if (!start.isValid() || !end.isValid() || !start || !end) {
    return '';
  }

  if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
    return formatDate(start);
  }

  if (start.year() != end.year()) {
    return `${formatDate(start)} ${word} ${formatDate(end)} `;
  }
  if (start.month() != end.month()) {
    return `${formatDate(start).split(' ')[0]} ${
      formatDate(start).split(' ')[1]
    } ${word} ${formatDate(end)} `;
  }
  return `${formatDate(start).split(' ')[0]} ${
    formatDate(start).split(' ')[1]
  } ${word} ${formatDate(end)} `;
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

export const formatPageTitle = title => {
  if (title) {
    return `${title} | Sportfolios`;
  }
  return 'Sportfolios';
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

  if (!isArray(emails)) {
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

export const validateEmail = email => {
  return (
    email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
  );
};
