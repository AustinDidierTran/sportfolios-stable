const fillWithZeros = (number, zeros = 0) => {
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

const formatPrice = price => (price / 100).toFixed(2);

const formatRoute = (route, params, queryParams) => {
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
      index === 0
        ? `${prev}?${key}=${queryParams[key]}`
        : `${prev}&${key}=${queryParams[key]}`,
    withParams,
  );
};

module.exports = {
  formatPrice,
  fillWithZeros,
  formatRoute,
};
