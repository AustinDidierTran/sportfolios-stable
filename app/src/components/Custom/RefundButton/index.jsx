import React from 'react';

import { IconButton } from '../../Custom';
import { createRefund } from '../../../actions/api/helpers';
import { useTranslation } from 'react-i18next';

export default function RefundButton(props) {
  const { t } = useTranslation();
  const { invoiceItemId } = props;

  const onClick = () => {
    createRefund({ invoiceItemId });
  };

  return (
    <IconButton
      color="primary"
      variant="contained"
      icon="MoneyOff"
      tooltip={t('refund')}
      onClick={onClick}
    />
  );
}
