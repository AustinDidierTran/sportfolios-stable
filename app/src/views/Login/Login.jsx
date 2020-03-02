import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormInput } from '../../hooks/forms';

import styles from './Login.module.css';

import { ACTION_ENUM, Store } from '../../Store';
import { makeStyles } from '@material-ui/core/styles';
import Button from '../../components/Button/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import TextField from '../../components/TextField/TextField';
import Typography from '@material-ui/core/Typography';
import { API_BASEURL } from '../../../../conf';

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

export default function Login() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const classes = useStyles();
  const email = useFormInput('');
  const password = useFormInput('');

  const login = async () => {
    const res = await fetch(`${API_BASEURL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const { data } = await res.json();

    if (data) {
      const { token } = JSON.parse(data);
      dispatch({
        type: ACTION_ENUM.LOGIN,
        payload: token,
      });
    } else {
      // TODO: 1 - handle login failure
    }
  };

  return (
    <div className={styles.main}>
      <Card className={classes.card}>
        <CardContent>
          <TextField {...email} placeholder={t('email')} fullWidth />
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
            onClick={login}
          >
            {t('login')}
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
