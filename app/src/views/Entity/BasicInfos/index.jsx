import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BasicInfos.module.css';
import BecomeMember from './BecomeMember';
import Donate from './Donate';
import { uploadEntityPicture } from '../../../actions/aws';
import {
  ACTION_ENUM,
  ENTITIES_ROLE_ENUM,
  Store,
} from '../../../Store';
import { useFormInput } from '../../../hooks/forms';
import api from '../../../actions/api';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Avatar, Input, Button } from '../../../components/Custom';
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
      role,
    },
  } = props;

  const isEditor = [
    ENTITIES_ROLE_ENUM.ADMIN,
    ENTITIES_ROLE_ENUM.EDITOR,
  ].includes(role);

  const [photo_url, setPhoto_url] = useState(initialPhoto_url);

  const [isLoading, setIsLoading] = useState(false);

  const [isEditMode, setEditMode] = useState(false);

  const [img, setImg] = useState(null);

  const name = useFormInput(initialName);

  useEffect(() => {
    name.changeDefault(initialName);
  }, [initialName]);

  useEffect(() => {
    setPhoto_url(initialPhoto_url);
  }, [initialPhoto_url]);

  const onSave = async () => {
    if (name.value.length < 1) {
      name.setError(t('value_is_required'));
    } else if (name.value.length > 255) {
      name.setError(t('value_is_too_long'));
    } else {
      setIsLoading(true);
      name.setError(false);

      const promises = [];

      if (img) {
        promises.push(onImgUpload());
      }

      promises.push(onNameChange());

      await Promise.all(promises);

      setEditMode(false);

      setIsLoading(false);
    }
  };

  const onNameChange = async () => {
    const res = await api(`/api/entity`, {
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
    name.setError(false);
    setEditMode(false);
  };

  const onEdit = async () => setEditMode(true);

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
      {isLoading ? (
        <div className={styles.div}>
          <CircularProgress className={styles.progress} />
        </div>
      ) : (
        <Avatar
          className={styles.avatar}
          photoUrl={photo_url}
          size="lg"
        />
      )}
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
              placeholder={t('name')}
              label={t('name')}
              error={name.error}
              className={styles.textField}
              namespace="Name"
            />
          ) : (
            <Typography variant="h3" className={styles.title}>
              {name.value}
            </Typography>
          )}
        </div>
      ) : (
        <></>
      )}
      {isEditor ? (
        isEditMode ? (
          <Container className={styles.buttons}>
            <Button
              className={styles.button1}
              endIcon="Check"
              onClick={onSave}
              style={{ marginRight: '8px' }}
            >
              {t('save')}
            </Button>
            <Button
              className={styles.button2}
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
        <div className={styles.buttons}>
          <BecomeMember className={styles.button1} />
          <Donate className={styles.button2} />
        </div>
      )}
    </Container>
  );
}
