import React, { useContext } from 'react';

import styles from './Login.module.css';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { Store, ACTION_ENUM } from '../../Store';

import { Container } from '../../components/Custom';
import { Typography, Button } from '../../components/MUI';
import logo from '../../img/bigLogo.png';

import { useTranslation } from 'react-i18next';
import { useQuery } from '../../hooks/queries';
import { useFormik } from 'formik';

import SignupCard from './SignupCard';
import LoginCard from './LoginCard';

export default function Login() {
  const { t } = useTranslation();
  const { successRoute } = useQuery();
  const { dispatch } = useContext(Store);

  const validate = values => {
    const errors = {};
    if (formik.status.state === 'signup') {
      if (!values.email) {
        errors.email = t('value_is_required');
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
          values.email,
        )
      ) {
        errors.email = t('invalid_email');
      }

      if (!values.firstName) {
        errors.firstName = t('value_is_required');
      }

      if (!values.lastName) {
        errors.lastName = t('value_is_required');
      }

      if (!values.password) {
        errors.password = t('value_is_required');
      } else if (
        values.password.length < 8 ||
        values.password.length > 16
      ) {
        errors.password = t('password_length');
      }
    } else {
      if (!values.email) {
        errors.email = t('value_is_required');
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
          values.email,
        )
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
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    initialStatus: {
      state: 'login',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async values => {
      if (formik.status.state === 'signup') {
        const { firstName, lastName, email, password } = values;

        const res = await api('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            successRoute,
          }),
        });
        if (res.status === 403) {
          formik.setFieldError('email', t('email_already_used'));
        } else if (res.status >= 400) {
          formik.setFieldError(
            'firstName',
            t('something_went_wrong'),
          );
        } else {
          goTo(ROUTES.confirmationEmailSent, { email });
        }
      } else {
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
          formik.setStatus({ state: 'signup' });
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

            if (successRoute) {
              goTo(successRoute);
            } else {
              goTo(ROUTES.home);
            }
          }
        }
      }
    },
  });

  if (formik.status.state === 'signup') {
    return (
      <div className={styles.main}>
        <Container className={styles.container}>
          <div className={styles.logo}>
            <img className={styles.img} src={logo} />
          </div>
          <SignupCard successRoute={successRoute} formik={formik} />
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <img className={styles.img} src={logo} />
        </div>
        <LoginCard formik={formik} />
        <div className={styles.or}>
          <Typography style={{ fontSize: 12 }}>{t('or')}</Typography>
        </div>

        <Button
          variant="outlined"
          color="primary"
          onClick={() => formik.setStatus({ state: 'signup' })}
          className={styles.buttonSignup}
          style={{ borderWidth: '2px' }}
        >
          {t('signup')}
        </Button>
      </Container>
    </div>
  );
}
