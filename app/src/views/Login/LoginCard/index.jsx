import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoginCard.module.css';
import {
  Button,
  CardActions,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';

import { AddGaEvent } from '../../../components/Custom/Analytics';

export default function LoginCard(props) {
  const { t } = useTranslation();
  const { formik } = props;

  return (
    <Paper className={styles.card}>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
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
            onClick={() =>
              AddGaEvent({
                category: 'Login',
                action: 'User clicked to log in',
                label: 'Login_page',
              })
            }
          >
            {t('login')}
          </Button>
        </CardActions>
        <Divider />
        <CardActions className={styles.linksContainer}>
          <Typography
            style={{
              fontSize: 12,
              textDecoration: 'none',
              color: 'grey',
              margin: '0 auto',
              cursor: 'pointer',
            }}
            onClick={() =>
              formik.setStatus({ state: 'forgotPassword' })
            }
          >
            {t('forgot_password')}
          </Typography>
        </CardActions>
      </form>
    </Paper>
  );
}
