import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import moment from 'moment';

import styles from './BasicInfos.module.css';

import { Store } from '../../../../Store';

import {
  Avatar,
  IconButton,
  Input,
} from '../../../../components/Custom';
import { Button, Card, Typography } from '../../../../components/MUI';
import { useFormInput } from '../../../../hooks/forms';
import api from '../../../../actions/api';

export default function BasicInfos(props) {
  const { t } = useTranslation();

  const {
    state: { userInfo },
  } = useContext(Store);
  const [isEditMode, setEditMode] = useState(false);

  const { birth_date } = userInfo;
  const completeName = `${userInfo.first_name} ${userInfo.last_name}`;
  const initials = completeName
    .split(/(?:-| )+/)
    .reduce(
      (prev, curr, index) =>
        index <= 2 ? `${prev}${curr[0]}` : prev,
      '',
    );

  const birthDate = useFormInput(birth_date);
  const onSave = async () => {
    const res = await api(
      `/api/profile/birthDate/${userInfo.user_id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ birthDate: birthDate.value }),
      },
    );

    if (res.status === 200) {
      birthDate.setCurrentAsDefault();
      setEditMode(false);
    }
  };

  const onCancel = async () => {
    setEditMode(false);
    birthDate.reset();
  };

  const onEdit = async () => setEditMode(true);

  return (
    <Card className={styles.card}>
      <Avatar className={styles.avatar}>{initials}</Avatar>
      <br />
      <Typography variant="h3">
        {completeName}
        {isEditMode ? (
          <>
            <IconButton icon="Check" onClick={onSave} />
            <IconButton icon="Close" onClick={onCancel} />
          </>
        ) : (
          <IconButton icon="Edit" onClick={onEdit} />
        )}
      </Typography>
      {isEditMode ? (
        <Input type="date" {...birthDate.inputProps} />
      ) : (
        <span>
          {t('birth_date_format', {
            age: moment().diff(moment(birthDate.value), 'years'),
            date: moment(birthDate.value),
          })}
        </span>
      )}
    </Card>
  );
}
