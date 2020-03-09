import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { Button, Card, CardContent, TextField, CardActions, Typography } from '../../../components/MUI';
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
      lastName: ''
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { firstName, lastName } = values;
      const res = await fetch(`${API_BASE_URL}/api/auth/changeBasicUserInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authToken, firstName, lastName
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
        formik.setValues({ firstName: data.first_name, lastName: data.last_name });
      });
  }, []);

  return (
    <Card className={styles.card}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
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
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            className={styles.button}
            type="submit"
          >
            {t('signup')}
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}