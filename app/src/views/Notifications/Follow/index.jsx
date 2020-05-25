import React, { useContext, useState, useEffect } from 'react';

import styles from './Follow.module.css';
import { Avatar, Icon } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { getInitialsFromName } from '../../../utils/stringFormats';
import history from '../../../stores/history';

import { Card, Button } from '../../../components/MUI';
import Typography from '@material-ui/core/Typography';

export default function Follow(props) {
  const { first_name, last_name, follower } = props.data;

  const onClosed = () => {
    console.log('CLOSED');
  };

  return (
    <div className={styles.n2}>
      <div
        className={styles.n3}
        onClick={() => history.push(`/profile/${follower}`)}
      >
        <Avatar
          initials={getInitialsFromName(`${first_name} ${last_name}`)}
          photoUrl={null}
          className={styles.avatar}
        />
        <Typography>
          <b>{`${first_name} ${last_name}`}</b> started following you.
        </Typography>
      </div>
      <Button color="primary" className={styles.button}>
        FOLLOW
      </Button>
    </div>
  );
}
