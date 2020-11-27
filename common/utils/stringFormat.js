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

module.exports = {
  formatPrice,
  fillWithZeros,
};
