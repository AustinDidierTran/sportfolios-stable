import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import moment from 'moment';

import styles from './BasicInfos.module.css';

import { Store, ACTION_ENUM } from '../../../../Store';

import {
  Avatar,
  Button,
  IconButton,
  Input,
} from '../../../../components/Custom';
import { Card, Typography } from '../../../../components/MUI';
import { useFormInput } from '../../../../hooks/forms';
import api from '../../../../actions/api';

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
    await onImgUpload();
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

  const onAddPhoto = async url => {
    await api(`/api/profile/photoUrl/${userInfo.user_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        photoUrl: url,
      }),
    });

    dispatch({
      type: ACTION_ENUM.UPDATE_PROFILE_PICTURE,
      payload: url,
    });
  };

  const uploadToS3 = async (file, signedRequest) => {
    const options = {
      headers: {
        'Access-Control-Allow-Origin': 's3.amazonaws.com',
        'Access-Control-Allow-Methods':
          'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
          'Origin, Content-Type, X-Auth-Token',
        'Content-Type': file.type,
      },
    };

    try {
      await axios.put(signedRequest, file, options);
    } catch (err) {
      console.log('err', err);
    }
  };

  const [img, setImg] = useState(null);

  const onImgChange = ([file]) => {
    setImg(file);
  };

  const onImgUpload = async () => {
    if (img) {
      const { data } = await api(
        `/api/profile/s3Signature/${userInfo.user_id}?fileType=${img.type}`,
      );

      await uploadToS3(img, data.signedRequest);
      await onAddPhoto(data.url);
    }
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
      <Typography variant="h3">{completeName}</Typography>
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
            style={{ marginRight: '2px' }}
          >
            Save
          </Button>
          <Button
            endIcon="Close"
            onClick={onCancel}
            style={{ marginLeft: '2px' }}
            color="secondary"
          >
            Cancel
          </Button>
        </>
      ) : (
        <Button onClick={onEdit} endIcon="Edit">
          Edit
        </Button>
      )}
    </Card>
  );
}
