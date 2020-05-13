import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import styles from './BasicInfos.module.css';

import { Store, ACTION_ENUM } from '../../../../Store';

import { Avatar, Button, Input } from '../../../../components/Custom';
import {
  Card,
  Typography,
  TextField,
} from '../../../../components/MUI';
import { useFormInput } from '../../../../hooks/forms';
import api from '../../../../actions/api';
import { uploadProfilePicture } from '../../../../actions/aws';

export default function BasicInfos(props) {
  const { t } = useTranslation();

  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);
  const [isEditMode, setEditMode] = useState(false);

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
  const onSave = async () => {
    const promises = [];

    if (img) {
      promises.push(onImgUpload());
    }

    if (birthDate.hasChanged) {
      promises.push(onBirthDateChange());
    }

    const res = await Promise.all(promises);

    const resErrors = res.filter(r => r.status !== 200);

    if (!resErrors.length) {
      birthDate.setCurrentAsDefault();
      setEditMode(false);
    } else {
      // handle errors
      resErrors.forEach(r => {
        if (r.data.key === 'birthDate') {
          if (r.status === 402) {
            // Date is in the future
            birthDate.setError(t('date_in_future'));
          }
          if (r.status === 403) {
            // Date is invalid
            birthDate.setError(t('invalid_date'));
          }
        }
      });
    }
  };

  const onCancel = async () => {
    setEditMode(false);
    birthDate.reset();
  };

  const onEdit = async () => setEditMode(true);

  const [img, setImg] = useState(null);

  const onImgChange = ([file]) => {
    setImg(file);
  };

  const onImgUpload = async () => {
    const photoUrl = await uploadProfilePicture(img);

    if (photoUrl) {
      dispatch({
        type: ACTION_ENUM.UPDATE_PROFILE_PICTURE,
        payload: photoUrl,
      });
      return { status: 200 };
    }
    return { status: 404 };
  };

  const onBirthDateChange = async () => {
    return api('/api/profile/birthDate', {
      method: 'PUT',
      body: JSON.stringify({ birthDate: birthDate.value }),
    });
  };

  const onFirstNameChange = async () => {
    console.log({ userInfo });
    console.log(userInfo.first_name);
  };
  const onLastNameChange = async () => {
    console.log({ userInfo });
    console.log(userInfo.last_name);
  };

  return (
    <Card className={styles.card}>
      <Avatar
        className={styles.avatar}
        initials={initials}
        photoUrl={photo_url}
      />
      {isEditMode ? (
        <Input type="file" onChange={onImgChange} />
      ) : (
        <></>
      )}
      <br />
      {isEditMode ? (
        <>
          <TextField
            namespace="firstName"
            type="text"
            label={t('first_name')}
            value={userInfo.first_name}
            onChange={onFirstNameChange}
          />
          <TextField
            namespace="lastName"
            type="text"
            label={t('last_name')}
            value={userInfo.last_name}
            onChange={onLastNameChange}
          />
        </>
      ) : (
        <Typography variant="h3">{completeName}</Typography>
      )}
      <br />
      {isEditMode ? (
        <Input type="date" {...birthDate.inputProps} />
      ) : birth_date ? (
        <span>
          {t('birth_date_format', {
            age: moment().diff(moment(birthDate.value), 'years'),
            date: moment(birthDate.value),
          })}
        </span>
      ) : (
        <></>
      )}
      <br />
      <br />

      {isEditMode ? (
        <>
          <Button
            endIcon="Check"
            onClick={onSave}
            style={{ marginRight: '8px' }}
          >
            {t('save')}
          </Button>
          <Button
            endIcon="Close"
            onClick={onCancel}
            style={{ marginLeft: '8px' }}
            color="secondary"
          >
            {t('cancel')}
          </Button>
        </>
      ) : (
        <Button onClick={onEdit} endIcon="Edit">
          {t('edit')}
        </Button>
      )}
    </Card>
  );
}
