import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './BasicInfos.module.css';
import BecomeMember from './BecomeMember';
import Donate from './Donate';
import { uploadProfilePicture } from '../../../actions/aws';
import { ACTION_ENUM, Store } from '../../../Store';

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

  const { name, photo_url } = props.basicInfos;

  const { isManager } = props;

  const [isEditMode, setEditMode] = useState(true);

  const onSave = async () => {
    const promises = [];

    if (img) {
      promises.push(onImgUpload());
    }

    const res = await Promise.all(promises);

    const resErrors = res.filter(r => r.status !== 200);

    if (!resErrors.length) {
      setEditMode(false);
    }
  };

  const onCancel = async () => {
    setEditMode(false);
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
      <div className={styles.fullName}>
        {isEditMode ? (
          <TextField
            className={styles.textField}
            namespace="Name"
            type="text"
            label={t('name')}
            defaultValue={name}
          />
        ) : (
          <Typography variant="h3">{name}</Typography>
        )}
      </div>
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
