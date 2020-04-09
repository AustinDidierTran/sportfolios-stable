import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { ACTION_ENUM, Store } from '../../Store';

import { Avatar } from '../../components/Custom';
import { Card, Typography, Container } from '../../components/MUI';

import styles from './Profile.module.css';

export default function Profile(props) {
  const { t } = useTranslation();
  const {
    state: { userInfo },
  } = useContext(Store);

  return (
    <Container className={styles.container}>
      <Card>
        <Avatar>H</Avatar>
        <br />
        <Typography
          variant="h3"
          className={styles.title}
          style={{ marginTop: 24 }}
        >{`${userInfo.first_name} ${userInfo.last_name}`}</Typography>
      </Card>
    </Container>
  );
}
