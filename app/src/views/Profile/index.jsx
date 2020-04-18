import React, { useContext } from 'react';

import { Store } from '../../Store';
import { Container } from '../../components/MUI';
import SelfProfile from './Self';
import OtherProfile from './Other';

import styles from './Profile.module.css';

export default function Profile(props) {
  const {
    state: { userInfo },
  } = useContext(Store);

  const user_id = userInfo && userInfo.user_id;

  const {
    match: {
      params: { id },
    },
  } = props;

  const isSelf = id === user_id;

  return (
    <Container className={styles.container}>
      {isSelf ? <SelfProfile /> : <OtherProfile userId={id} />}
    </Container>
  );
}
