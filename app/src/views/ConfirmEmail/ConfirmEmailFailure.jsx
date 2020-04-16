import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '../../components/Custom';

import {
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '../../components/MUI';

import styles from './ConfirmEmail.module.css';
import { goTo, ROUTES } from '../../actions/goTo';

export default function ConfirmEmail() {
  const { t } = useTranslation();

  return (
    <Container className={styles.container}>
      <Card className={styles.card}>
        <CardContent>
          <Typography>{t('email_confirm_failure')}</Typography>
        </CardContent>
        <CardActions>
          <Button
            endIcon="NavigateNext"
            onClick={() => goTo(ROUTES.login)}
          >
            {t('go_to_login')}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
