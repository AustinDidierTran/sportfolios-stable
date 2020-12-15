import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import { Avatar } from '../';

import styles from './ProfileChip.module.css';
import { getInitialsFromName } from '../../../utils/stringFormats';
import { goTo, ROUTES } from '../../../actions/goTo';

const useStyles = makeStyles({
  avatar: {
    width: '30px !important',
    height: '30px !important',
    borderWidth: '3px !important',
  },
  noBorder: {
    border: 'none',
  },
});

export default function ProfileChip(props) {
  const classes = useStyles();
  const { photoUrl, nameObj, entityId } = props;

  return (
    <Chip
      className={styles.chip}
      label={nameObj.name}
      avatar={
        <Avatar
          className={
            photoUrl
              ? [classes.avatar, classes.noBorder].join(' ')
              : classes.avatar
          }
          photoUrl={photoUrl}
          initials={getInitialsFromName(nameObj)}
        />
      }
      variant="outlined"
      onClick={() =>
        goTo(ROUTES.entity, {
          id: entityId,
        })
      }
    />
  );
}
