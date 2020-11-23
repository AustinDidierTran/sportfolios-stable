import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import styles from './PasswordRecovery.module.css';

import {
  Button,
  CardActions,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '../../components/MUI';
import { Paper } from '../../components/Custom';
import api from '../../actions/api';
import { useQuery } from '../../hooks/queries';
import { goTo, ROUTES } from '../../actions/goTo';
import { Store, ACTION_ENUM } from '../../Store';
import { LOGO_ENUM } from '../../../../common/enums';

export default function PasswordRecovery() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const { token, email } = useQuery();
  const validate = values => {
    const errors = {};
    if (!values.password) {
      errors.password = t('value_is_required');
    } else if (
      values.password.length < 8 ||
      values.password.length > 24
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
      const { password } = values;
      const res = await api('/api/auth/recoverPassword', {
        method: 'POST',
        body: JSON.stringify({
          token,
          password,
        }),
      });
      if (res.status === 200) {
        const { authToken, userInfo } = res.data;
        dispatch({
          type: ACTION_ENUM.LOGIN,
          payload: authToken,
        });
        dispatch({
          type: ACTION_ENUM.UPDATE_USER_INFO,
          payload: userInfo,
        });
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('password_reset_message'),
        });
        goTo(ROUTES.home);
      }
      if (res.status === 403) {
        // Token expired
        formik.setFieldError('password', t('token_expired'));
      }
    },
  });

  return (
    <div className={styles.main}>
      <Paper className={styles.card}>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.logo}>
            <img
              className={styles.img}
              src={LOGO_ENUM.LOGO_256X256}
            />
          </div>
          <CardContent>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              {t('you_can_now_change_your_password', { email })}
            </Typography>
            <TextField
              namespace="password"
              formik={formik}
              label={t('new_password')}
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
              {t('reset_password')}
            </Button>
          </CardActions>
          <Divider />
        </form>
      </Paper>
    </div>
  );
}
