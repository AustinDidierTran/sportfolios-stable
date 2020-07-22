import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './SignupCard.module.css';

import {
  Button,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Typography,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';

export default function SignupCard(props) {
  const { t } = useTranslation();
  const { formik } = props;

  return (
    <Paper className={styles.signup}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
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
            style={{ color: '#fff' }}
          >
            {t('signup')}
          </Button>
        </CardActions>
        <Divider />
        <CardActions className={styles.linksContainer}>
          <div
            className={styles.typo}
            onClick={() => formik.setStatus({ state: 'login' })}
          >
            <Typography
              style={{
                textDecoration: 'none',
                color: 'grey',
                margin: '0 auto',
                fontSize: 12,
              }}
            >
              {t('have_an_account_signin')}
            </Typography>
          </div>
        </CardActions>
      </form>
    </Paper>
  );
}
