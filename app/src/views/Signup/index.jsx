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

  const firstName = useFormInput('');
  const lastName = useFormInput('');
  const email = useFormInput('');
  const password = useFormInput('');

  const signup = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
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
            {...firstName}
            placeholder={t('first_name')}
            fullWidth
          />
          <TextField
            {...lastName}
            placeholder={t('last_name')}
            fullWidth
          />
          <TextField
            {...email}
            placeholder={t('email')}
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
          <Link to={'/login'}>
            <Typography>{t('have_an_account_signin')}</Typography>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
