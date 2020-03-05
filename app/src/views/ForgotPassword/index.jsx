import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './ForgotPassword.module.css';

import { ACTION_ENUM, Store } from '../../Store';
import Button from '../../components/Button/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import TextField from '../../components/TextField/TextField';
import Typography from '@material-ui/core/Typography';
import { API_BASE_URL } from '../../../../conf';

export default function ForgotPassword() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = t('value_is_required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t('invalid_email');
    }
    return errors;
  }

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async values => {
      const { email } = values;
      const res = await fetch(`${API_BASE_URL}/api/auth/recoveryEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (res.status === 404) {
        // Email not found
        formik.setFieldError('email', t('email_not_found'));
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
            <Link to={'/login'}>
              <Typography>{t('login')}</Typography>
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
