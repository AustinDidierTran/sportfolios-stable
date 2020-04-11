import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './SignupCard.module.css';

import {
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Typography,
} from '../../../components/MUI';

import api from '../../../actions/api';
import { goTo, ROUTES } from '../../../actions/goTo';

export default function SignupCard(props) {
  const { setCard } = props;
  const { t } = useTranslation();

  const validate = values => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = t('value_is_required');
    }

    if (!values.lastName) {
      errors.lastName = t('value_is_required');
    }

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
      const { firstName, lastName, email, password } = values;

      const res = await api('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      console.log('res', res);

      if (res.status === 403) {
        formik.setFieldError('email', t('email_already_used'));
      } else if (res.status >= 400) {
        formik.setFieldError('firstName', t('something_went_wrong'));
      } else {
        goTo(ROUTES.confirmationEmailSent, { email });
      }
    },
  });

  return (
    <Card className={styles.signup}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {t('signup')}
          </Typography>
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
          >
            {t('signup')}
          </Button>
        </CardActions>
        <Divider />
        <CardActions className={styles.linksContainer}>
          <Link to={ROUTES.login}>
            <Typography>{t('have_an_account_signin')}</Typography>
          </Link>
        </CardActions>
      </form>
    </Card>
  );
}
