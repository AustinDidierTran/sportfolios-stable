import React from 'react';

import { goTo, ROUTES } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './YourPayments.module.css';
import {
  Typography,
  Card,
  ListItem,
  Button,
  Container,
} from '../../../components/MUI';
import { List } from '../../../components/Custom';

export default function YourPayments(props) {
  const { t } = useTranslation();

  const { payments } = props;

  return (
    <Card className={styles.card} gutterBottom>
      <Typography
        className={styles.title}
        variant="h3"
        color="primary"
      >
        {t('payments')}
      </Typography>
      {payments.map(payment => (
        <Container className={styles.container}>
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
          <Button color="Primary" className={styles.button}>
            {t('pay')}
          </Button>
        </Container>
      ))}
    </Card>
  );
}
