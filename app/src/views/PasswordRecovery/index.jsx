import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './PasswordRecovery.module.css';

import { Button, Card, CardActions, CardContent, Divider, TextField, Typography } from '../../components/MUI';
import api from '../../actions/api';

export default function Login(props) {
  const { match: { params: { token } } } = props;

  const { t } = useTranslation();

  const validate = values => {
    const errors = {};
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
      const { password } = values;
      const res = await api('/api/auth/recoverPassword', {
        method: 'POST',
        body: JSON.stringify({
          token,
          password,
        }),
      });

      if (res.status === 403) {
        // Token expired
        formik.setFieldError('password', t('token_expired'));
      }
    }
  })

  return (
    <div className={styles.main}>
      <Card className={styles.card}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
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
