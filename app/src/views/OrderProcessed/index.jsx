import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../utils/stringFormats';

import { MessageAndButton } from '../../components/Custom';

export default function OrderProcessed() {
  const { t } = useTranslation();

  const goToReceipt = () => {
    goTo(ROUTES.home);
  };

  const total = 300;
  const totalFormatted = formatPrice(total);

  const lastDigits = 3886;

  const values = {
    message:
      'Order processed! \n' +
      `Your total is ${totalFormatted}` +
      '\n' +
      `paid with this credit card **** **** **** ${lastDigits}`,
    onClick: goToReceipt,
    button: t('receipt'),
    endIcon: 'Receipt',
  };

  return (
    <MessageAndButton
      button={values.button}
      onClick={values.onClick}
      endIcon={values.endIcon}
      message={values.message}
      title={t('Order processed')}
    />
  );
}
