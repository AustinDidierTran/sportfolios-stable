import React, { useContext, useEffect } from 'react';
import i18n from '../../../i18n';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Button,
  CardContent,
  CardActions,
  Select,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import styles from './BasicInfo.module.css';

import api from '../../../actions/api';
import { Store } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function BasicInfo() {
  const {
    state: { authToken },
  } = useContext(Store);
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = t('value_is_required');
    }

    if (!values.lastName) {
      errors.lastName = t('value_is_required');
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      language: '',
      address: '',
      phoneNumber: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { language } = values;

      const res = await api(`/api/user/changeBasicUserInfo`, {
        method: 'POST',
        body: JSON.stringify({
          authToken,
          language,
        }),
      });

      if (res.status === 402) {
        // Token is expired, redirect
        goTo(ROUTES.login);
      } else if (res.status >= 400) {
        formik.setFieldError('address', t('something_went_wrong'));
      }
    },
  });

  const setBasicInfoValues = async () => {
    const { data } = await api('/api/user/userInfo');

    formik.setValues({
      language: data.language,
    });
  };

  useEffect(() => {
    setBasicInfoValues();
  }, []);

  useEffect(() => {
    if (formik.values.language) {
      i18n.changeLanguage(formik.values.language);
    }
  }, [formik.values.language]);

  return (
    <Paper className={styles.card} title={t('basic_info')}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <CardContent className={styles.inputs}>
          <Select
            formik={formik}
            label={t('select_language')}
            namespace="language"
            options={[
              { value: 'en', display: 'English' },
              { value: 'fr', display: 'Français' },
            ]}
          />
        </CardContent>
        <CardActions className={styles.buttons}>
          <Button
            size="small"
            color="primary"
            variant="contained"
            className={styles.button}
            type="submit"
          >
            {t('save_basic_info')}
          </Button>
        </CardActions>
      </form>
    </Paper>
  );
}
