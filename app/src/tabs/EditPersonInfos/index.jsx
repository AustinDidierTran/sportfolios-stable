import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Input,
  Button,
  Avatar,
  AddressSearchInput,
  LoadingSpinner,
  Select,
} from '../../components/Custom';
import api from '../../actions/api';
import { useTranslation } from 'react-i18next';
import styles from './EditPersonInfos.module.css';
import { ACTION_ENUM, Store } from '../../Store';
import { getInitialsFromName } from '../../utils/stringFormats';
import { uploadEntityPicture } from '../../actions/aws';
import { GENDER_ENUM } from '../../../../common/enums';
import { useFormik } from 'formik';

export default function EditPersonInfos(props) {
  const { basicInfos } = props;
  const { t } = useTranslation();
  const { id: personId } = useParams();
  const {
    /* eslint-disable-next-line */
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  const {
    id,
    name: nameProp,
    surname: surnameProp,
    photoUrl: initialPhotoUrl,
    role,
  } = basicInfos;

  const [isLoading, setIsLoading] = useState(false);

  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [birthDate, setBirthDate] = useState();
  const [gender, setGender] = useState();
  const [address, setAddress] = useState();

  const [changesMade, setChangesMade] = useState(false);

  const initials = getInitialsFromName(
    surnameProp ? `${nameProp} ${surnameProp}` : nameProp,
  );

  const [img, setImg] = useState(null);

  useEffect(() => {
    setName(nameProp);
    setSurname(surnameProp);
    setBirthDate('');
    setGender('');
  }, []);

  useEffect(() => {
    setPhotoUrl(initialPhotoUrl);
  }, [initialPhotoUrl]);

  /*const formik = useFormik({
    
      }
    },
  });*/

  const onSave = async () => {
    console.log('Saving');
    setIsLoading(true);
    /*const promises = [];

    if (img) {
      promises.push(onImgUpload());
    }

    if (fullName.hasChanged) {
      promises.push(onNameChange());
    }

    if (birthDate.hasChanged) {
    }

    if (gender.hasChanged) {
    }

    if (address.hasChanged) {
    }

    const res = await Promise.all(promises);

    const resErrors = res.filter(r => r.status !== 200);

    if (!resErrors.length) {
    } else {
      // handle errors
    }*/
    setIsLoading(false);
  };

  const onCancel = async () => {
    //name.reset();
    console.log('Cancel');
  };

  const onImgChange = file => {
    console.log(file);
    setImg(file);
    console.log(URL.createObjectURL(file));
    setPhotoUrl(URL.createObjectURL(file));
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

  const onNameChange = async () => {
    const res = await changeEntityName(id, {
      name: fullName.name,
      surname: fullName.surname,
    });
    //name.changeDefault(res.data.name);

    return res;
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  // USE FORMIK!!!
  // You have included the Google Maps JavaScript API multiple times on this page. This may cause unexpected errors.

  const valueChanged = () => {
    setChangesMade(true);
  };

  return (
    <Paper className={styles.card}>
      <Avatar initials={initials} photoUrl={photoUrl} size="lg" />
      <Button
        variant="outlined"
        endIcon="CloudUploadIcon"
        style={{ marginTop: '8px', marginBottom: '6px' }}
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
          onChange={valueChanged}
          defaultValue={name}
        />
        <Input
          className={styles.zone2}
          helperText={t('last_name')}
          type="text"
          onChange={valueChanged}
          defaultValue={surname}
        />
      </div>
      <div className={styles.div2equal}>
        <Input
          className={styles.zone1}
          helperText={t('birth_date')}
          type="date"
          onChange={valueChanged}
          defaultValue={birthDate}
        />
        <Input
          className={styles.zone2}
          helperText={t('gender')}
          type="text"
          onChange={valueChanged}
          defaultValue={gender}
        />
        {/*<Select
          className={styles.zone2}
          options={[
            GENDER_ENUM.MALE,
            GENDER_ENUM.FEMALE,
            GENDER_ENUM.NOT_SPECIFIED,
          ]}
          namespace="gender"
          autoFocus
          margin="dense"
          label={t('gender')}
          fullWidth
          //onChange={onChange}
          //value={}
        />*/}
      </div>

      <div className={styles.divSearch}>
        <AddressSearchInput language={userInfo.language} />
      </div>

      {changesMade ? (
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
      ) : (
        <></>
      )}
    </Paper>
  );
}
