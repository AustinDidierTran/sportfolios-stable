import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';
import history from '../../stores/history';

import styles from './Signup.module.css';

import Button from '../../components/Button/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '../../components/TextField/TextField';
import { API_BASE_URL } from '../../../../conf';

console.log('API_BASEURL', API_BASE_URL);

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: 32,
    maxWidth: 534,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  loginButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  linksContainer: {
    justifyContent: 'space-between',
  },
  button: {
    width: '100%',
  },
}));

export default function Signup() {
  const { t } = useTranslation();
  const classes = useStyles();

  const email = useFormInput('');
  const password = useFormInput('');

  const signup = async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const body = await res.json();

    history.push('/confirmation_email_sent');
  };

  return (
    <div className={styles.main}>
      <Card className={classes.card}>
        <CardContent>
          <TextField
            {...email}
            placeholder={t('username')}
            fullWidth
          />
          <TextField
            {...password}
            placeholder={t('password')}
            type="password"
            fullWidth
          />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={signup}
          >
            {t('signup')}
          </Button>
        </CardActions>
        <Divider />
        <CardActions className={classes.linksContainer}>
          <Link to={'/forgot_password'}>
            <Typography>{t('forgot_password')}</Typography>
          </Link>
          <Link to={'/signup'}>
            <Typography>{t('no_account_signup')}</Typography>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
