import React, { useState, useEffect, useContext } from 'react';
import styles from './EditPersonInfos.module.css';
import {
  Paper,
  Button,
  Avatar,
  AddressSearchInput,
  LoadingSpinner,
} from '../../components/Custom';
import { TextField, Typography } from '../../components/MUI';
import MenuItem from '@material-ui/core/MenuItem';
import api from '../../actions/api';
import { useTranslation } from 'react-i18next';
import { getInitialsFromName } from '../../utils/stringFormats';
import { uploadEntityPicture } from '../../actions/aws';
import { useFormik } from 'formik';
import { formatRoute } from '../.../../../actions/goTo';
import { ACTION_ENUM, Store } from '../../Store';
import {
  GENDER_ENUM,
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
const moment = require('moment');

export default function EditPersonInfos(props) {
  const { basicInfos } = props;
  const { t } = useTranslation();
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  const {
    id: personId,
    name: nameProp,
    surname: surnameProp,
    photoUrl: initialPhotoUrl,
  } = basicInfos;

  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [personInfos, setPersonInfos] = useState({});
  const [changesMade, setChangesMade] = useState(false);

  const initials = getInitialsFromName(
    surnameProp ? `${nameProp} ${surnameProp}` : nameProp,
  );

  const getPersonInfos = async () => {
    const { data } = await api(
      formatRoute('/api/entity/personInfos', null, {
        entityId: personId,
      }),
    );

    setPersonInfos(data);
  };

  useEffect(() => {
    getPersonInfos();
  }, []);

  useEffect(() => {
    formik.setFieldValue('name', personInfos.name || '');
    formik.setFieldValue('surname', personInfos.surname || '');
    formik.setFieldValue('birthDate', personInfos.birthDate || '');
    formik.setFieldValue('gender', personInfos.gender || '');
    formik.setFieldValue('address', personInfos.address || '');
    formik.setFieldValue(
      'addressFormatted',
      personInfos.formattedAddress || '',
    );
    setPhotoUrl(personInfos.photoUrl);
  }, [personInfos]);

  const validate = values => {
    const { name, surname, gender } = values;
    const errors = {};
    if (!name.length) {
      errors.name = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!surname.length) {
      errors.surname = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!gender.length) {
      errors.gender = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!birthDate.value) {
      errors.birthDate = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      birthDate: '',
      gender: '',
      formattedAddress: '',
      address: '',
    },
    validate,
    validateOnChange: false,
    onSubmit: async values => {
      const { name, surname, birthDate, gender, address } = values;

      setIsLoading(true);

      if (img) {
        const photoUrl = await uploadEntityPicture(personId, img);
        if (photoUrl) {
          setPhotoUrl(photoUrl);
        }
      }

      const res = await api(`/api/entity/updatePersonInfos`, {
        method: 'PUT',
        body: JSON.stringify({
          entityId: personId,
          personInfos: { name, surname, birthDate, gender, address },
        }),
      });
      if (res.status === STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('informations_saved'),
          severity: SEVERITY_ENUM.SUCCESS,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
        });
      }

      setIsLoading(false);
      setChangesMade(false);
    },
  });

  const onCancel = async () => {
    formik.resetForm();
    getPersonInfos();
    setChangesMade(false);
  };

  // Show preview
  const onImgChange = file => {
    setImg(file);
    setPhotoUrl(URL.createObjectURL(file)); // used as a preview only
    setChangesMade(true);
  };

  const addressChanged = newAddress => {
    formik.setFieldValue('address', newAddress);
    setChangesMade(true);
  };

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  const valueChanged = () => {
    setChangesMade(true);
  };

  return (
    <Paper className={styles.card} formik={formik}>
      <form onSubmit={formik.handleSubmit}>
        <Avatar initials={initials} photoUrl={photoUrl} size="lg" />
        <Button
          variant="outlined"
          endIcon="CloudUploadIcon"
          style={{ marginTop: '8px', marginBottom: '16px' }}
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
          <TextField
            namespace="name"
            className={styles.zone1}
            formik={formik}
            type="name"
            helperText={t('first_name')}
            onChange={valueChanged}
          />
          <TextField
            namespace="surname"
            className={styles.zone2}
            formik={formik}
            type="surname"
            helperText={t('last_name')}
            onChange={valueChanged}
          />
        </div>
        <div className={styles.div2equal}>
          <TextField
            namespace="birthDate"
            className={styles.zone1}
            formik={formik}
            type="date"
            InputProps={{
              inputProps: {
                max: moment(new Date()).format('YYYY-MM-DD'),
              },
            }}
            helperText={t('birth_date')}
            onChange={valueChanged}
          />
          <TextField
            namespace="gender"
            className={styles.zone2}
            formik={formik}
            select
            type="gender"
            helperText={t('gender')}
            onChange={valueChanged}
          >
            <MenuItem value={GENDER_ENUM.FEMALE}>
              {t('female')}
            </MenuItem>
            <MenuItem value={GENDER_ENUM.MALE}>{t('male')}</MenuItem>
            <MenuItem value={GENDER_ENUM.NOT_SPECIFIED}>
              {t('do_not_specify')}
            </MenuItem>
          </TextField>
        </div>

        <div className={styles.divSearch}>
          <AddressSearchInput
            namespace="addressFormatted"
            formik={formik}
            addressChanged={addressChanged}
            country="ca"
            language={userInfo.language}
          />
        </div>
        {personInfos.formattedAddress ? (
          <div className={styles.address}>
            <Typography variant="caption" color="textSecondary">
              {t('address')}
            </Typography>
          </div>
        ) : (
          <></>
        )}

        {changesMade ? (
          <div className={styles.buttons}>
            <Button
              endIcon="SaveIcon"
              style={{ marginRight: '8px' }}
              type="submit"
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
      </form>
    </Paper>
  );
}
