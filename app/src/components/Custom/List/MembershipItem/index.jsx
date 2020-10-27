import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';
import { useTranslation } from 'react-i18next';
import { Chip } from '@material-ui/core';
import { INVOICE_STATUS_ENUM } from '../../../../../../common/enums';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function MembershipItem(props) {
  const { t } = useTranslation();
  const { primary, secondary, status } = props;
  return (
    <ListItem style={{ width: '100%' }}>
      <ListItemText
        primary={primary}
        secondary={secondary}
      ></ListItemText>
      {status === INVOICE_STATUS_ENUM.PAID ? (
        <Chip label={t('paid')} color="primary" variant="outlined" />
      ) : (
        <Chip
          label={t('not_paid')}
          color="secondary"
          variant="outlined"
          onClick={() => {
            goTo(ROUTES.cart);
          }}
        />
      )}
    </ListItem>
  );
}
