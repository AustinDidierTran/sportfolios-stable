import React, { useContext, useEffect } from 'react';
import i18n from '../../../i18n';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Card, CardContent, TextField, CardActions, Select, Typography } from '../../../components/MUI';
import styles from './BasicInfo.module.css';

import { API_BASE_URL } from '../../../../../conf';
import { Store } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function BasicInfo(props) {
  const { state: { authToken } } = useContext(Store);
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};

    if (!values.firstName) {
      errors.firstName = t('value_is_required');
    }

    if (!values.lastName) {
      errors.lastName = t('value_is_required');
    }
  }

  const formik = useFormik({
    initialValues: {
      firstName: '',
      language: '',
      lastName: ''
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { firstName, language, lastName } = values;

      const res = await fetch(`${API_BASE_URL}/api/auth/changeBasicUserInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken, firstName, language, lastName
        })
      });


      if (res.status === 402) {
        // Token is expired, redirect
        goTo(ROUTES.login);
      } else if (res.status >= 400) {
        formik.setFieldError('lastName', t('something_went_wrong'));
      }
    }
  })

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/userInfo?authToken=${authToken}`)
      .then((res) => res.json())
      .then(({ data }) => {
        formik.setValues({ firstName: data.first_name, language: data.language, lastName: data.last_name });
      });
  }, []);

  useEffect(() => {
    if (formik.values.language) {
      i18n.changeLanguage(formik.values.language)
    }
  }, [formik.values.language])

  return (
    <Card className={styles.card}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <CardContent className={styles.inputs}>
          <Typography gutterBottom variant="h5" component="h2">{t('basic_info')}</Typography>
          <TextField
            namespace="firstName"
            formik={formik}
            type="text"
            label={t('first_name')}
            fullWidth
          />
          <TextField
            namespace="lastName"
            formik={formik}
            type="text"
            label={t('last_name')}
            fullWidth
          />
          <Select formik={formik} label={t('select_language')} namespace="language" options={[
            { value: 'en', display: 'English' },
            { value: 'fr', display: 'Français' }
          ]} />
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
    </Card>
  )
}