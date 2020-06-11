import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './ForgotPasswordCard.module.css';

import Button from '../../../components/MUI/Button';
import {
  CardActions,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';
import api from '../../../actions/api';
import { ROUTES } from '../../../actions/goTo';

export default function ForgotPassword() {
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
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { email } = values;
      const res = await api('/api/auth/recoveryEmail', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      });

      if (res.status === 404) {
        // Email not found
        formik.setFieldError('email', t('email_not_found'));
      }
    },
  });

  return (
    <div className={styles.main}>
      <form onSubmit={formik.handleSubmit}>
        <Paper className={styles.card}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {t('forgot_password')}
            </Typography>
            <TextField
              namespace="email"
              formik={formik}
              type="email"
              label={t('email')}
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
              {t('send_password_recovery_email')}
            </Button>
          </CardActions>
          <Divider />
          <CardActions className={styles.linksContainer}>
            <Link to={ROUTES.login}>
              <Typography>{t('have_an_account_signin')}</Typography>
            </Link>
            <Link to={ROUTES.signup}>
              <Typography>{t('no_account_signup')}</Typography>
            </Link>
          </CardActions>
        </Paper>
      </form>
    </div>
  );
}
