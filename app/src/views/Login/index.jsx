import React, { useContext } from 'react';

import styles from './Login.module.css';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { Store, ACTION_ENUM } from '../../Store';

import { Container } from '../../components/Custom';
import { Typography, Button } from '../../components/MUI';

import { useTranslation } from 'react-i18next';
import { useQuery } from '../../hooks/queries';
import { useFormik } from 'formik';

import SignupCard from './SignupCard';
import LoginCard from './LoginCard';
import ForgotPasswordCard from './ForgotPasswordCard';
import {
  LOGO_ENUM,
  SEVERITY_ENUM,
  LOGIN_STATE_ENUM,
} from '../../../../common/enums';

export default function Login() {
  const { t } = useTranslation();
  const { successRoute, redirectUrl } = useQuery();
  const { dispatch } = useContext(Store);

  const validate = values => {
    const errors = {};
    if (formik.status.state === LOGIN_STATE_ENUM.SIGNUP) {
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
        values.password.length > 24
      ) {
        errors.password = t('password_length');
      }
    } else if (formik.status.state === LOGIN_STATE_ENUM.LOGIN) {
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
        values.password.length > 24
      ) {
        errors.password = t('password_length');
      }
    } else if (
      formik.status.state === LOGIN_STATE_ENUM.FORGOT_PASSWORD
    ) {
      if (!values.email) {
        errors.email = t('value_is_required');
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
          values.email,
        )
      ) {
        errors.email = t('invalid_email');
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
      state: LOGIN_STATE_ENUM.LOGIN,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async values => {
      if (formik.status.state === LOGIN_STATE_ENUM.SIGNUP) {
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
      } else if (formik.status.state === LOGIN_STATE_ENUM.LOGIN) {
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
          formik.setStatus({ state: LOGIN_STATE_ENUM.SIGNUP });
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t(
              'you_have_no_account_with_this_email_create_one',
            ),
            severity: SEVERITY_ENUM.INFO,
          });
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
            if (redirectUrl) {
              goTo(redirectUrl);
            } else if (successRoute) {
              goTo(ROUTES.confirmEmailSuccess, null, {
                successRoute,
              });
            } else {
              if (formik.status.state === LOGIN_STATE_ENUM.SIGNUP) {
                goTo(ROUTES.confirmEmailSuccess);
              } else {
                goTo(ROUTES.home);
              }
            }
          }
        }
      } else if (
        formik.status.state === LOGIN_STATE_ENUM.FORGOT_PASSWORD
      ) {
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
          formik.setStatus({ state: LOGIN_STATE_ENUM.SIGNUP });
        }
        if (res.status === 200) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('confirmation_email_sent'),
          });
        }
      }
    },
  });

  if (formik.status.state === LOGIN_STATE_ENUM.SIGNUP) {
    return (
      <div className={styles.main}>
        <Container className={styles.container}>
          <div className={styles.logo}>
            <img className={styles.img} src={LOGO_ENUM.LOGO} />
          </div>
          <SignupCard successRoute={successRoute} formik={formik} />
        </Container>
      </div>
    );
  }

  if (formik.status.state === LOGIN_STATE_ENUM.FORGOT_PASSWORD) {
    return (
      <div className={styles.main}>
        <Container className={styles.container}>
          <div className={styles.logo}>
            <img className={styles.img} src={LOGO_ENUM.LOGO} />
          </div>
          <ForgotPasswordCard formik={formik} />
        </Container>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <Container className={styles.container}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO} />
        </div>
        <LoginCard formik={formik} />
        <div className={styles.or}>
          <Typography style={{ fontSize: 12 }}>{t('or')}</Typography>
        </div>

        <Button
          variant="outlined"
          color="primary"
          onClick={() =>
            formik.setStatus({ state: LOGIN_STATE_ENUM.SIGNUP })
          }
          className={styles.buttonSignup}
          style={{ borderWidth: '2px' }}
        >
          {t('signup')}
        </Button>
      </Container>
    </div>
  );
}
