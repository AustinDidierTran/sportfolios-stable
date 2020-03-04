import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './Login.module.css';

import { ACTION_ENUM, Store } from '../../Store';
import Button from '../../components/Button/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import TextField from '../../components/TextField/TextField';
import Typography from '@material-ui/core/Typography';
import { API_BASE_URL } from '../../../../conf';

export default function Login() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = 'Value is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'Value is required';
    } else if (values.password.length < 8 || values.password.length > 16) {
      errors.password = 'Password must be within 8 to 16 characters long';
    }
    return errors;
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
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
        formik.setFieldError('email', 'Email has not been confirmed. Please look at your emails.');
      }

      if (res.status === 403) {
        // Password is not good
        formik.setFieldError('password', 'Email and password do not match. Please try again.');
      }

      const { data } = await res.json();

      if (data) {
        const { token } = JSON.parse(data);
        dispatch({
          type: ACTION_ENUM.LOGIN,
          payload: token,
        });
      } else {
        // TODO: 1 - handle login failure
      }
    }
  })

  return (
    <div className={styles.main}>
      <Card className={styles.card}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <TextField
              id="email"
              name="email"
              type="email"
              placeholder={t('email')}
              onChange={formik.handleChange}
              fullWidth
              error={formik.errors.email}
              helperText={formik.errors.email}
            />
            <TextField
              id="password"
              name="password"
              placeholder={t('password')}
              type="password"
              onChange={formik.handleChange}
              fullWidth
              error={formik.errors.password}
              helperText={formik.errors.password}
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
    </div>
  );
}
