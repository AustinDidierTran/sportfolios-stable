import { MEMBERSHIP_TYPE_ENUM } from '../../Store';

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
