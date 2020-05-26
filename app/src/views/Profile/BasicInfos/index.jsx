import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import styles from './BasicInfos.module.css';

import { ACTION_ENUM } from '../../../Store';

import { Avatar, Button, Input } from '../../../components/Custom';
import {
  Container,
  Typography,
  TextField,
} from '../../../components/MUI';
import { getInitialsFromName } from '../../../utils/stringFormats';
import api from '../../../actions/api';
import { useFormInput } from '../../../hooks/forms';
import { uploadProfilePicture } from '../../../actions/aws';

export default function BasicInfos(props) {
  const { t } = useTranslation();
  const [isEditMode, setEditMode] = useState(false);

  const {
    first_name,
    last_name,
    birth_date,
    photo_url,
  } = props.basicInfos;
  const completeName = `${first_name} ${last_name}`;
  const initials = getInitialsFromName(completeName);
  const birthDate = useFormInput(birth_date);

  const { isSelf } = props;

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
    //TODO
    console.log(first_name);
  };
  const onLastNameChange = async () => {
    //TODO
    console.log(first_name);
  };

  const [isFollowing, setIsFollowing] = useState(false);

  const onFollow = async () => {
    setIsFollowing(true);
  };

  const onUnfollow = async () => {
    setIsFollowing(false);
  };

  return (
    <Container className={styles.card}>
      <Avatar initials={initials} photoUrl={photo_url} size="lg" />
      {isEditMode ? (
        <Input
          type="file"
          onChange={onImgChange}
          isVisible={isEditMode}
        />
      ) : (
        <></>
      )}
      <div className={styles.fullName}>
        {isEditMode ? (
          <>
            <TextField
              namespace="firstName"
              type="text"
              label={t('first_name')}
              value={first_name}
              onChange={onFirstNameChange}
            />
            <TextField
              namespace="lastName"
              type="text"
              label={t('last_name')}
              value={last_name}
              onChange={onLastNameChange}
            />
          </>
        ) : (
          <Typography variant="h3">{completeName}</Typography>
        )}
      </div>
      {isEditMode ? (
        <Input type="date" {...birthDate.inputProps} />
      ) : birth_date ? (
        <TextField
          disabled
          value={t('birth_date_format', {
            age: moment().diff(moment(birth_date), 'years'),
            date: moment(birth_date),
          })}
        />
      ) : (
        <></>
      )}
      {isSelf ? (
        isEditMode ? (
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
        )
      ) : isFollowing ? (
        <Button onClick={onUnfollow} variant="outlined">
          {t('following')}
        </Button>
      ) : (
        <Button onClick={onFollow}>{t('follow')}</Button>
      )}
    </Container>
  );
}
