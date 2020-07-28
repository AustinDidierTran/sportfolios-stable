import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  formatPrice,
  formatPageTitle,
} from '../../utils/stringFormats';

import { Paper, Button, IgContainer } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { useQuery } from '../../hooks/queries';
import styles from './OrderProcessed.module.css';
import { LOGO_ENUM } from '../../../../common/enums';

export default function OrderProcessed() {
  const { paid, last4, receiptUrl } = useQuery();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = formatPageTitle('Order Processed');
  }, []);

  const goToReceipt = () => {
    window.location.href = receiptUrl;
  };

  const totalFormatted = formatPrice(paid);

  const cardNumber = '**** **** **** ' + last4;

  const onClick = goToReceipt;
  const button = t('receipt');
  const endIcon = 'Receipt';

  return (
    <IgContainer>
      <Paper style={{ textAlign: 'center' }}>
        <div className={styles.logo}>
          <img className={styles.img} src={LOGO_ENUM.LOGO} />
        </div>
        <Typography style={{ margin: '8px' }} variant="h5">
          {t('order_processed')}
        </Typography>
        <Typography style={{ margin: '8px' }}>
          Total:&nbsp;
          {totalFormatted}
        </Typography>
        <Typography style={{ margin: '8px' }}>
          {t('paid_with')}
          &nbsp;
          {cardNumber}
        </Typography>
        <Typography
          style={{ margin: '8px' }}
          color="textSecondary"
          component="p"
        >
          {t('to_see_your_receipt')}
        </Typography>
        <Button
          size="small"
          variant="contained"
          endIcon={endIcon}
          style={{
            margin: '8px',
          }}
          onClick={onClick}
        >
          {button}
        </Button>
      </Paper>
    </IgContainer>
  );
}
