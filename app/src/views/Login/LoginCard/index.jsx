import React from 'react';
import { Link } from 'react-router-dom';
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
import { ROUTES } from '../../../actions/goTo';

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
          >
            {t('login')}
          </Button>
        </CardActions>
        <Divider />
        <CardActions className={styles.linksContainer}>
          <Link
            style={{
              textDecoration: 'none',
              color: 'grey',
              margin: '0 auto',
            }}
            to={ROUTES.forgotPassword}
          >
            <Typography style={{ fontSize: 12 }}>
              {t('forgot_password')}
            </Typography>
          </Link>
        </CardActions>
      </form>
    </Paper>
  );
}
