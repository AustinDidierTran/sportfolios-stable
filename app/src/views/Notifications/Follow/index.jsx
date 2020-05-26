import React, { useContext, useState, useEffect } from 'react';

import styles from './Follow.module.css';
import { Avatar, Icon } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { getInitialsFromName } from '../../../utils/stringFormats';
import history from '../../../stores/history';

import { Card, Button } from '../../../components/MUI';
import Typography from '@material-ui/core/Typography';

export default function Follow(props) {
  const { first_name, last_name, follower } = props;
  const [buttonState, setButtonState] = useState(true);

  const onFollow = () => {
    setButtonState(!buttonState);
    if (buttonState) {
      alert(`Followed ${first_name} ${last_name}`);
    } else {
      alert(`No longer following ${first_name} ${last_name}`);
    }
  };

  return (
    <div className={styles.follow}>
      <div
        className={styles.information}
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
      <Button
        color="primary"
        className={buttonState ? styles.button : styles.buttonpressed}
        onClick={onFollow}
      >
        FOLLOW
      </Button>
    </div>
  );
}
