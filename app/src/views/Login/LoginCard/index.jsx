import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './LoginCard.module.css';

import { ACTION_ENUM, Store } from '../../../Store';
import { Button, Card, CardActions, CardContent, Divider, TextField, Typography } from '../../../components/MUI';
import { API_BASE_URL } from '../../../../../conf';
import { goTo, ROUTES } from '../../../actions/goTo';


export default function LoginCard() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = t('value_is_required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t('invalid_email');
    }

    if (!values.password) {
      errors.password = t('value_is_required');
    } else if (values.password.length < 8 || values.password.length > 16) {
      errors.password = t('password_length');
    }
    return errors;
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { email, password } = values;
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.status === 401) {
        // Email is not validated
        await fetch(`${API_BASE_URL}/api/auth/sendConfirmationEmail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        });
        formik.setFieldError('email', t('email_not_confirmed'));
      }

      if (res.status === 403) {
        // Password is not good
        formik.setFieldError('password', t('email_password_no_match'));
      }

      const { data } = await res.json();

      if (data) {
        const { token } = JSON.parse(data);
        dispatch({
          type: ACTION_ENUM.LOGIN,
          payload: token,
        });
        goTo(ROUTES.userSettings);
      }
    }
  })

  return (
    <Card className={styles.card}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">{t('login')}</Typography>
          <TextField
            namespace="email"
            formik={formik}
            type="email"
            placeholder={t('email')}
            fullWidth
          />
          <TextField
            namespace="password"
            formik={formik}
            placeholder={t('password')}
            type="password"
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
            {t('login')}
          </Button>
        </CardActions>
        <Divider />
        <CardActions className={styles.linksContainer}>
          <Link to={'/forgot_password'}>
            <Typography>{t('forgot_password')}</Typography>
          </Link>
          <Link to={'/signup'}>
            <Typography>{t('no_account_signup')}</Typography>
          </Link>
        </CardActions>
      </form>
    </Card>
  )
}