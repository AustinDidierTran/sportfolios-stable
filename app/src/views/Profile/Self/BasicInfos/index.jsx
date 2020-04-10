import React, { useContext } from 'react';
import moment from 'moment';

import styles from './BasicInfos.module.css';

import { Store } from '../../../../Store';

import { Avatar, Input } from '../../../../components/Custom';
import { Button, Card, Typography } from '../../../../components/MUI';
import { useFormInput } from '../../../../hooks/forms';
import api from '../../../../actions/api';

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

  console.log('userInfo', userInfo);

  const today = moment().format('YYYY-MM-DD');
  const birthDate = useFormInput(today);
  const onSaveBirthDate = async () => {
    console.log('birthDate', birthDate);

    const res = await api(
      `/api/profile/birthDate/${userInfo.user_id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ birthDate: birthDate.value }),
      },
    );

    console.log('res', res);
  };

  return (
    <Card className={styles.card}>
      <Avatar className={styles.avatar}>{initials}</Avatar>
      <br />
      <Typography variant="h3">{completeName}</Typography>
      <Input type="date" {...birthDate.inputProps} />
      <Button onClick={onSaveBirthDate}>Save</Button>
    </Card>
  );
}
