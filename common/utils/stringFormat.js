import { CLIENT_BASE_URL } from '../../conf.js';

export const fillWithZeros = (number, zeros = 0) => {
  if (!zeros) {
    return number;
  }
  const parsedNumber = Number(number);

  const numberOfDigits =
    parsedNumber === 0
      ? 1
      : Math.floor(Math.log(parsedNumber) / Math.log(10)) + 1;

  const zerosToAdd = zeros - numberOfDigits;

  const zerosArray = Array(zerosToAdd).fill(0);

  return zerosArray.reduce(prev => `0${prev}`, `${parsedNumber}`);
};

export const formatPrice = price => (price / 100).toFixed(2);

export const formatClientRoute = (route, params, queryParams) => {
  const res = formatRoute(`${CLIENT_BASE_URL}${route}`, params, queryParams);
  return res;
};

export const formatRoute = (route, params, queryParams) => {
  if (!route) {
    /* eslint-disable-next-line */
    console.error('Route is undefined');
  }

  if (!params && !queryParams) {
    return route;
  }

  const withParams = params
    ? Object.keys(params).reduce(
        (prev, curr) => prev.replace(`:${curr}`, params[curr]),
        route,
      )
    : route;

  if (!queryParams) {
    return withParams;
  }

  return Object.keys(queryParams).reduce(
    (prev, key, index) =>
      !queryParams[key]
        ? prev
        : index === 0
        ? `${prev}?${key}=${queryParams[key]}`
        : `${prev}&${key}=${queryParams[key]}`,
    withParams,
  );
};

export const formatAddress = address => {
  if (!address) {
    return '';
  }
  return `${address.street_address}, ${address.city} ${address.state} ${address.country}, ${address.zip}`;
};
