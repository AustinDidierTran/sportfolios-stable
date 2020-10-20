import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
} from '../../../../../common/enums';

import styles from './BasicInfos.module.css';

import { ACTION_ENUM, Store } from '../../../Store';

import {
  Avatar,
  Button,
  Input,
  LoadingSpinner,
} from '../../../components/Custom';
import {
  Container,
  Typography,
  TextField,
} from '../../../components/MUI';
import { getInitialsFromName } from '../../../utils/stringFormats';
/* eslint-disable-next-line */
import api, { changeEntityName } from '../../../actions/api';
import { useFormInput } from '../../../hooks/forms';
import { uploadEntityPicture } from '../../../actions/aws';

export default function BasicInfos(props) {
  const { t } = useTranslation();
  const {
    /* eslint-disable-next-line */
    state: { userInfo },
    dispatch,
  } = useContext(Store);
  const [isEditMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    id,
    name: nameProp,
    surname,
    photoUrl: initialPhotoUrl,
    role,
    type,
  } = props.basicInfos;

  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);

  useEffect(() => {
    setPhotoUrl(initialPhotoUrl);
  }, [initialPhotoUrl]);

  const initials = getInitialsFromName(nameProp);
  const name = useFormInput(nameProp);

  const onNameChange = async () => {
    const res = await changeEntityName(id, {
      name: name.value,
    });
    name.changeDefault(res.data.name);

    return res;
  };

  const onSave = async () => {
    setIsLoading(true);
    const promises = [];

    if (name.hasChanged) {
      promises.push(onNameChange());
    }

    if (img) {
      promises.push(onImgUpload());
    }

    const res = await Promise.all(promises);

    const resErrors = res.filter(r => r.status !== 200);

    if (!resErrors.length) {
      setEditMode(false);
    } else {
      // handle errors
    }
    setIsLoading(false);
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
      setPhotoUrl(photoUrl);

      dispatch({
        type: ACTION_ENUM.UPDATE_PROFILE_PICTURE,
        payload: photoUrl,
      });
      return { status: 200 };
    }
    return { status: 404 };
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  return (
    <Container className={styles.card}>
      <Avatar initials={initials} photoUrl={photoUrl} size="lg" />
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
              namespace="name"
              type="text"
              label={t('name')}
              {...name.inputProps}
            />
          </>
        ) : (
          <Typography variant="h3" className={styles.text}>
            {`${name.value}${surname ? ' ' + surname : ''}`}
          </Typography>
        )}
      </div>
      {role === ENTITIES_ROLE_ENUM.ADMIN &&
      type !== GLOBAL_ENUM.PERSON ? (
        isEditMode ? (
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
        ) : (
          <Button onClick={onEdit} endIcon="Edit">
            {t('edit')}
          </Button>
        )
      ) : (
        <></>
      )}
    </Container>
  );
}
