import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './LoginCard.module.css';

import { ACTION_ENUM, Store } from '../../../Store';
import {
  Button,
  CardActions,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import api from '../../../actions/api';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function LoginCard() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = t('value_is_required');
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = t('invalid_email');
    }

    if (!values.password) {
      errors.password = t('value_is_required');
    } else if (
      values.password.length < 8 ||
      values.password.length > 16
    ) {
      errors.password = t('password_length');
    }
    return errors;
  };

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
      const res = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.status === 401) {
        // Email is not validated
        await api('/api/auth/sendConfirmationEmail', {
          method: 'POST',
          body: JSON.stringify({
            email,
          }),
        });
        formik.setFieldError('email', t('email_not_confirmed'));
      } else if (res.status === 403) {
        // Password is not good
        formik.setFieldError(
          'password',
          t('email_password_no_match'),
        );
      } else if (res.status === 404) {
        formik.setFieldError('email', t('email_not_found'));
      } else {
        let { data } = res;

        if (data) {
          if (typeof data === 'string') {
            data = JSON.parse(data);
          }

          const { token, userInfo } = data;

          dispatch({
            type: ACTION_ENUM.LOGIN,
            payload: token,
          });
          dispatch({
            type: ACTION_ENUM.UPDATE_USER_INFO,
            payload: userInfo,
          });

          goTo(ROUTES.home);
        }
      }
    },
  });

  return (
    <Paper className={styles.card}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <TextField
            namespace="email"
            formik={formik}
            type="email"
            label={t('email')}
            fullWidth
          />
          <TextField
            namespace="password"
            formik={formik}
            label={t('password')}
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
            style={{ color: '#fff' }}
          >
            {t('login')}
          </Button>
        </CardActions>
        <Divider />
        <CardActions className={styles.linksContainer}>
          <Link
            style={{
              textDecoration: 'none',
              color: 'grey',
              margin: '0 auto',
            }}
            to={ROUTES.forgotPassword}
          >
            <Typography style={{ fontSize: 12 }}>
              {t('forgot_password')}
            </Typography>
          </Link>
        </CardActions>
      </form>
    </Paper>
  );
}
