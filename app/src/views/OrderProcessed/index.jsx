import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/stringFormats';

import { Paper, Button, Container } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { useQuery } from '../../hooks/queries';

export default function OrderProcessed() {
  const { paid, last4, receiptUrl } = useQuery();
  const { t } = useTranslation();

  const goToReceipt = () => {
    window.location.href = receiptUrl;
  };

  const totalFormatted = formatPrice(paid);

  const cardNumber = '**** **** **** ' + last4;

  const onClick = goToReceipt;
  const button = t('receipt');
  const endIcon = 'Receipt';

  return (
    <Container>
      <Paper style={{ textAlign: 'center' }}>
        <Typography style={{ margin: '8px' }}>
          {t('order_processed')}
          <br />
          {t('your_total_is')}
          &nbsp;
          {totalFormatted}
          <br />
          {t('you_paid_with')}
          &nbsp;
          {cardNumber}
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
    </Container>
  );
}
