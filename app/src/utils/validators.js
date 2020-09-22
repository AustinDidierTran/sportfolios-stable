export const hasXDigits = (number, numberOfDigits) => {
  return (
    number >= 10 * (numberOfDigits - 1) &&
    number < 10 * numberOfDigits
  );
};
