import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './ForgotPasswordCard.module.css';

import { Store } from '../../../Store';
import Button from '../../../components/MUI/Button';
import { Card, CardActions, CardContent, Divider, TextField, Typography } from '../../../components/MUI';
import { API_BASE_URL } from '../../../../../conf';

export default function ForgotPassword(props) {
  const { setCard } = props;
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
            <Link onClick={() => setCard(3)}>
              <Typography>{t('login')}</Typography>
            </Link>
            <Link onClick={() => setCard(1)}>
              <Typography>{t('no_account_signup')}</Typography>
            </Link>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}
