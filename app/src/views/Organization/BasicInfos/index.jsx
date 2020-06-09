import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BasicInfos.module.css';
import BecomeMember from './BecomeMember';
import Donate from './Donate';
import { uploadEntityPicture } from '../../../actions/aws';
import { ACTION_ENUM, Store } from '../../../Store';
import { useFormInput } from '../../../hooks/forms';
import api from '../../../actions/api';

import {
  Avatar,
  Input,
  Button,
  Paper,
} from '../../../components/Custom';
import {
  Typography,
  TextField,
  Container,
} from '../../../components/MUI';

export default function BasicInfos(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const {
    basicInfos: {
      id,
      name: initialName,
      photo_url: initialPhoto_url,
    },
  } = props;

  const [photo_url, setPhoto_url] = useState(initialPhoto_url);

  const name = useFormInput(initialName);

  useEffect(() => {
    name.changeDefault(initialName);
  }, [initialName]);

  useEffect(() => {
    setPhoto_url(initialPhoto_url);
  }, [initialPhoto_url]);

  const { isManager } = props;

  const [isEditMode, setEditMode] = useState(true);

  const onSave = async () => {
    const promises = [];

    if (img) {
      promises.push(onImgUpload());
    }

    promises.push(onNameChange());

    const res = await Promise.all(promises);

    setEditMode(false);
  };

  const onNameChange = async () => {
    const res = await api(`/api/organization`, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        name: name.value,
      }),
    });
    name.changeDefault(res.data.data.name);
  };

  const onCancel = async () => {
    name.reset();
    setEditMode(false);
  };

  const onEdit = async () => setEditMode(true);

  const [img, setImg] = useState(null);

  const onImgChange = ([file]) => {
    setImg(file);
  };

  const onImgUpload = async () => {
    const photoUrl = await uploadEntityPicture(id, img);

    if (photoUrl) {
      setPhoto_url(photoUrl);
      dispatch({
        type: ACTION_ENUM.UPDATE_ORGANIZATION_PROFILE_PICTURE,
        payload: photoUrl,
      });
      return { status: 200 };
    }
    return { status: 404 };
  };

  return (
    <Container className={styles.paper}>
      <Avatar
        className={styles.avatar}
        photoUrl={photo_url}
        size="lg"
      />
      {isEditMode ? (
        <Input
          className={styles.input}
          type="file"
          onChange={onImgChange}
          isVisible={isEditMode}
        />
      ) : (
        <></>
      )}
      {name ? (
        <div className={styles.fullName}>
          {isEditMode ? (
            <TextField
              {...name.inputProps}
              className={styles.textField}
              namespace="Name"
              label={t('name')}
            />
          ) : (
            <Typography variant="h3">{name.value}</Typography>
          )}
        </div>
      ) : (
        <></>
      )}
      {isManager ? (
        isEditMode ? (
          <Container className={styles.buttons}>
            <Button
              className={styles.save}
              endIcon="Check"
              onClick={onSave}
              style={{ marginRight: '8px' }}
            >
              {t('save')}
            </Button>
            <Button
              className={styles.cancel}
              endIcon="Close"
              onClick={onCancel}
              style={{ marginLeft: '8px' }}
              color="secondary"
            >
              {t('cancel')}
            </Button>
          </Container>
        ) : (
          <Container className={styles.edit}>
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              endIcon="Edit"
              onClick={onEdit}
            >
              {t('edit')}
            </Button>
          </Container>
        )
      ) : (
        <>
          <BecomeMember className={styles.button} />
          <Donate className={styles.button} />
        </>
      )}
    </Container>
  );
}
