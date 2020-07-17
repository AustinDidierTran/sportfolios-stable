import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/stringFormats';

import { Paper, Button } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { goTo, ROUTES } from '../../actions/goTo';

export default function OrderProcessed() {
  const { t } = useTranslation();

  const goToReceipt = () => {
    goTo(ROUTES.home);
  };

  const total = 300;
  const totalFormatted = formatPrice(total);

  const lastDigits = 3886;
  const cardNumber = '**** **** **** ' + lastDigits;

  const onClick = goToReceipt;
  const button = t('receipt');
  const endIcon = 'Receipt';

  return (
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
  );
}
