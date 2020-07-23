import React from 'react';

import { IconButton } from '../../Custom';
import { unregister } from '../../../actions/api/helpers';
import { useTranslation } from 'react-i18next';

export default function UnregisterButton(props) {
  const { t } = useTranslation();
  const { eventId, rosterId } = props;

  const onClick = () => {
    unregister({ eventId, rosterId });
  };

  return (
    <IconButton
      color="primary"
      variant="contained"
      icon="MoneyOff"
      tooltip={t('refund')}
      onClick={onClick}
      style={{ color: '#18b393' }}
    />
  );
}
