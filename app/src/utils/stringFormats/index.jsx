export function getInitialsFromName(completeName) {
  return completeName
    .split(/(?:-| )+/)
    .reduce(
      (prev, curr, index) =>
        index <= 2 ? `${prev}${curr[0]}` : prev,
      '',
    )
    .toUpperCase();
}
