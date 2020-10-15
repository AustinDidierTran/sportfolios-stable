import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Input,
  Button,
  Avatar,
  AddressSearchInput,
} from '../../components/Custom';
import api from '../../actions/api';
import { useTranslation } from 'react-i18next';
import styles from './EditPersonInfos.module.css';
import { ACTION_ENUM, Store } from '../../Store';
import { getInitialsFromName } from '../../utils/stringFormats';

export default function EditPersonInfos(props) {
  const { basicInfos } = props;
  const { t } = useTranslation();
  const { id: personId } = useParams();
  const {
    /* eslint-disable-next-line */
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const initials = getInitialsFromName(
    surnameProp ? `${nameProp} ${surnameProp}` : nameProp,
  );

  const {
    id,
    name: nameProp,
    surname: surnameProp,
    photoUrl: initialPhotoUrl,
    role,
  } = basicInfos;

  const [img, setImg] = useState(null);

  //const [isEditMode, setEditMode] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);
  //const { dispatch } = useContext(Store);

  useEffect(() => {
    setPhotoUrl(initialPhotoUrl);
  }, [initialPhotoUrl]);

  const onSave = async () => {
    /*setIsLoading(true);
    const promises = [];

    if (name.hasChanged) {
      promises.push(onNameChange());
    }*/

    if (img) {
      promises.push(onImgUpload());
    }

    /*const res = await Promise.all(promises);

    const resErrors = res.filter(r => r.status !== 200);

    if (!resErrors.length) {
      setEditMode(false);
    } else {
      // handle errors
    }
    setIsLoading(false);*/
    console.log('Save');
  };

  const onCancel = async () => {
    /*name.reset();
    setEditMode(false);*/
    console.log('Cancel');
  };

  const onImgChange = file => {
    console.log(file);
    setImg(file);
    console.log(URL.createObjectURL(file));
    setPhotoUrl(URL.createObjectURL(file));
  };

  return (
    <Paper className={styles.card}>
      <Avatar initials={initials} photoUrl={photoUrl} size="lg" />
      <Button
        variant="outlined"
        endIcon="CloudUploadIcon"
        style={{ margin: '6px' }}
        component="label"
      >
        {t('change_picture')}

        <input
          onChange={e => onImgChange(e.target.files[0])}
          type="file"
          hidden
        />
      </Button>

      <div className={styles.div2equal}>
        <Input
          className={styles.zone1}
          helperText={t('first_name')}
          type="text"
        />
        <Input
          className={styles.zone2}
          helperText={t('last_name')}
          type="text"
        />
      </div>
      <div className={styles.div2equal}>
        <Input
          className={styles.zone1}
          helperText={t('birth_date')}
          type="date"
        />
        <Input
          className={styles.zone2}
          helperText={t('gender')}
          type="text"
        />
      </div>

      <div className={styles.divSingleItem}>
        <Input
          helperText={t('street_address')}
          type="text"
          styles={{ width: '100%' }}
        />
      </div>
      <div className={styles.divSingleItem}>
        <Input helperText={t('city')} type="text" />
      </div>
      <div className={styles.divStateZip}>
        <Input
          className={styles.zone1}
          helperText={t('state')}
          type="text"
        />
        <Input
          className={styles.zone2}
          helperText={t('postal_code')}
          type="text"
        />
      </div>
      <div className={styles.divSingleItem}>
        <Input helperText={t('country')} type="text" />
      </div>

      <AddressSearchInput />

      <div className={styles.buttons}>
        <Button
          endIcon="SaveIcon"
          onClick={onSave}
          style={{ marginRight: '8px' }}
        >
          {t('save')}
        </Button>
        <Button
          endIcon="Cancel"
          onClick={onCancel}
          style={{ marginLeft: '8px' }}
          color="secondary"
        >
          {t('cancel')}
        </Button>
      </div>
    </Paper>
  );
}
