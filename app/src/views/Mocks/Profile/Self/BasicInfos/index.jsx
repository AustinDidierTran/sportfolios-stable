import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import styles from './BasicInfos.module.css';

import { Store } from '../../../../../Store';

import { Avatar } from '../../../../../components/Custom';
import {
  Card,
  Typography,
  TextField,
} from '../../../../../components/MUI';
import { useFormInput } from '../../../../../hooks/forms';

export default function BasicInfos(props) {
  const { t } = useTranslation();

  const {
    state: { userInfo },
  } = useContext(Store);

  const { birth_date, photo_url } = userInfo;
  const completeName = `${userInfo.first_name} ${userInfo.last_name}`;
  const initials = completeName
    .split(/(?:-| )+/)
    .reduce(
      (prev, curr, index) =>
        index <= 2 ? `${prev}${curr[0]}` : prev,
      '',
    );

  const birthDate = useFormInput(birth_date);

  return (
    <Card className={styles.card}>
      <Avatar
        className={styles.avatar}
        initials={initials}
        photoUrl={photo_url}
        size="lg"
      />
      <Typography variant="h3">{completeName}</Typography>
      <Typography variant="h5">
        {t('birth_date_format', {
          age: moment().diff(moment(birthDate.value), 'years'),
          date: moment(birthDate.value),
        })}
      </Typography>
    </Card>
  );
}
