import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './Signup.module.css';

import history from '../../stores/history';

import Button from '../../components/Button/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '../../components/TextField/TextField';
import { API_BASE_URL } from '../../../../conf';

export default function Signup() {
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
      const { firstName, lastName, email, password } = values;

      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      history.push('/confirmation_email_sent');
    }
  });

  return (
    <div className={styles.main}>
      <Card className={styles.card}>
        <form onSubmit={formik.handleSubmit}>
          <CardContent>
            <TextField
              id="firstName"
              name="firstName"
              type="text"
              placeholder={t('first_name')}
              onChange={formik.handleChange}
              fullWidth
              error={formik.errors.firstName}
              helperText={formik.errors.firstName}
            />
            <TextField
              id="lastName"
              name="lastName"
              type="text"
              placeholder={t('last_name')}
              onChange={formik.handleChange}
              fullWidth
              error={formik.errors.lastName}
              helperText={formik.errors.lastName}
            />
            <TextField
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              placeholder={t('email')}
              fullWidth
              error={formik.errors.email}
              helperText={formik.errors.email}
            />
            <TextField
              id="password"
              onChange={formik.handleChange}
              name="password"
              placeholder={t('password')}
              type="password"
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
              {t('signup')}
            </Button>
          </CardActions>
          <Divider />
          <CardActions className={styles.linksContainer}>
            <Link to={'/login'}>
              <Typography>{t('have_an_account_signin')}</Typography>
            </Link>
          </CardActions>
        </form>
      </Card>
    </div>
  );
}
