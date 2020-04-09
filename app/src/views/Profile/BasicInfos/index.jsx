import React, { useContext } from 'react';

import styles from './BasicInfos.module.css';

import { Store } from '../../../Store';

import { Avatar } from '../../../components/Custom';
import { Card, Typography } from '../../../components/MUI';

export default function BasicInfos(props) {
  const {
    state: { userInfo },
  } = useContext(Store);
  const completeName = `${userInfo.first_name} ${userInfo.last_name}`;
  const initials = completeName
    .split(/(?:-| )+/)
    .reduce(
      (prev, curr, index) =>
        index <= 2 ? `${prev}${curr[0]}` : prev,
      '',
    );

  console.log('initials', initials);

  return (
    <Card className={styles.card}>
      <Avatar className={styles.avatar}>{initials}</Avatar>
      <br />
      <Typography variant="h3">{completeName}</Typography>
    </Card>
  );
}
