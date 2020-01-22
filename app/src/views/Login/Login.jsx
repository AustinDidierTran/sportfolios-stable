import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import styles from './Login.module.css';

import Button from '../../components/Button/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '../../components/TextField/TextField';

const useStyles = makeStyles(theme => ({
  card: {
    marginTop: 32,
    maxWidth: 400,
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

export default function Login(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={styles.main}>
      <Card className={classes.card}>
        <CardContent>
          <TextField placeholder={t('username')} fullWidth />
          <TextField
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
          >
            {t('login')}
          </Button>
        </CardActions>
        <Divider />
        <CardActions className={classes.linksContainer}>
          <Link>
            <Typography>{t('forgot_password')}</Typography>
          </Link>
          <Link>
            <Typography>{t('no_account_signup')}</Typography>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
