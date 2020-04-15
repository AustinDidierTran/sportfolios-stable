import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
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
import { useEffect } from 'react';

export default function BasicInfos(props) {
  const { t } = useTranslation();

  const {
    state: { userInfo },
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

  const onS3Signature = async () => {
    const res = await api(
      `/api/profile/s3Signature/${userInfo.user_id}`,
    );

    console.log('res', res);
  };

  const onAddPhoto = async () => {
    const res = await api(
      `/api/profile/photoUrl/${userInfo.user_id}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          photoUrl:
            'https://pimage.sport-thieme.de/detail-fillscale/frisbee-freestyle-frisbee/134-4644',
        }),
      },
    );
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
    console.log('img.type', img.type);

    const { data } = await api(
      `/api/profile/s3Signature/${userInfo.user_id}?fileType=${img.type}`,
    );

    console.log('data', data);

    await uploadToS3(img, data.signedRequest);
  };

  useEffect(() => {
    console.log('img', img);
  }, [img]);

  return (
    <Card className={styles.card}>
      <Avatar
        className={styles.avatar}
        initials={initials}
        photoUrl={photo_url}
      />
      <IconButton icon="Check" onClick={onS3Signature} />
      <IconButton icon="AddAPhoto" onClick={onAddPhoto} />
      <Input type="file" onChange={onImgChange} />
      <IconButton icon="Publish" onClick={onImgUpload} />
      <br />
      <Typography variant="h3">
        {completeName}
        {isEditMode ? (
          <>
            <IconButton icon="Check" onClick={onSave} />
            <IconButton icon="Close" onClick={onCancel} />
          </>
        ) : (
          <>
            <IconButton icon="Edit" onClick={onEdit} />
          </>
        )}
      </Typography>
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
    </Card>
  );
}
