import React, { useState, useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './BasicInfos.module.css';
import { uploadEntityPicture } from '../../../actions/aws';
import { ACTION_ENUM, Store } from '../../../Store';
import { useFormInput } from '../../../hooks/forms';
import { useEditor } from '../../../hooks/roles';
import { changeEntityName } from '../../../actions/api';

import {
  Avatar,
  Input,
  Button,
  Paper,
  LoadingSpinner,
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
      photoUrl: initialPhotoUrl,
      role,
    },
  } = props;

  const isEditor = useEditor(role);

  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);

  const [isLoading, setIsLoading] = useState(false);

  const [isEditMode, setEditMode] = useState(false);

  const [img, setImg] = useState(null);

  const name = useFormInput(initialName);

  useEffect(() => {
    name.changeDefault(initialName);
  }, [initialName]);

  useEffect(() => {
    setPhotoUrl(initialPhotoUrl);
  }, [initialPhotoUrl]);

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

      if (name.hasChanged) {
        promises.push(onNameChange());
      }

      await Promise.all(promises);

      setEditMode(false);

      setIsLoading(false);
    }
  };

  const onNameChange = async () => {
    const res = await changeEntityName(id, { name: name.value });

    name.changeDefault(res.data.name);
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
      setPhotoUrl(photoUrl);
      dispatch({
        type: ACTION_ENUM.UPDATE_ORGANIZATION_PROFILE_PICTURE,
        payload: photoUrl,
      });
      return { status: 200 };
    }
    return { status: 404 };
  };

  if (isEditMode) {
    return (
      <Paper style={{ textAlign: 'center' }} title={name.value}>
        <Container style={{ paddingBottom: '16px' }}>
          {isLoading ? (
            <LoadingSpinner isComponent />
          ) : (
            <Avatar
              className={styles.avatar}
              photoUrl={photoUrl}
              variant="square"
              size="lg"
            />
          )}
          <Input
            className={styles.input}
            type="file"
            onChange={onImgChange}
            isVisible={isEditMode}
          />
          <TextField
            {...name.inputProps}
            placeholder={t('name')}
            label={t('name')}
            error={name.error}
            className={styles.textField}
            namespace="Name"
          />
          <div className={styles.editor}>
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
          </div>
        </Container>
      </Paper>
    );
  }

  return (
    <Paper title={name.value}>
      <Container className={styles.paper}>
        <Avatar
          className={styles.avatar}
          photoUrl={photoUrl}
          variant="square"
          size="lg"
        />
        {name ? (
          <div className={styles.fullName}>
            <Typography variant="h3" className={styles.title}>
              {name.value}
            </Typography>
          </div>
        ) : (
          <></>
        )}
        {isEditor ? (
          <Container className={styles.edit}>
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              endIcon="Edit"
              onClick={onEdit}
              style={{ margin: '8px' }}
            >
              {t('edit')}
            </Button>
          </Container>
        ) : (
          <></>
        )}
      </Container>
    </Paper>
  );
}
