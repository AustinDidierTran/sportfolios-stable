import React from 'react';

import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './YourPayments.module.css';
import {
  Typography,
  ListItem,
  Button,
  Container,
} from '../../../components/MUI';
import { Paper } from '../../../components/Custom';

export default function YourPayments(props) {
  const { t } = useTranslation();

  const { payments } = props;

  return (
    <Paper className={styles.paper}>
      <Typography
        className={styles.title}
        variant="h3"
        color="primary"
      >
        {t('awaiting_payments')}
      </Typography>
      {payments.map((payment, index) => (
        <Container className={styles.container} key={index}>
          <Typography variant="h5" className={styles.title}>
            {payment.title}
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            className={styles.subtitle}
          >
            {payment.subtitle}
          </Typography>
          <Typography variant="h3" className={styles.price}>
            {payment.price}
          </Typography>
          <Button color="primary" className={styles.button}>
            {t('pay')}
          </Button>
        </Container>
      ))}
    </Paper>
  );
}
