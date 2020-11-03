import React, { useMemo } from 'react';
import { ListItem, ListItemText } from '../../../MUI';
import { useTranslation } from 'react-i18next';
import { Chip } from '@material-ui/core';
import { INVOICE_STATUS_ENUM } from '../../../../../../common/enums';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function MembershipItem(props) {
  const { t } = useTranslation();
  const { primary, secondary, status } = props;

  const label = useMemo(() => {
    if (status === INVOICE_STATUS_ENUM.PAID) {
      return t('paid');
    } else if (status === INVOICE_STATUS_ENUM.FREE) {
      return t('free');
    } else {
      return t('not_paid');
    }
  }, [status]);
  const color = useMemo(() => {
    if (
      status === INVOICE_STATUS_ENUM.PAID ||
      status === INVOICE_STATUS_ENUM.FREE
    ) {
      return 'primary';
    } else {
      return 'secondary';
    }
  }, [status]);
  const onClick = useMemo(() => {
    if (
      status === INVOICE_STATUS_ENUM.PAID ||
      status === INVOICE_STATUS_ENUM.FREE
    ) {
      return () => {};
    } else {
      return () => goTo(ROUTES.cart);
    }
  }, [status]);

  return (
    <ListItem style={{ width: '100%' }}>
      <ListItemText
        primary={primary}
        secondary={secondary}
      ></ListItemText>
      <Chip
        label={label}
        color={color}
        variant="outlined"
        onClick={onClick}
      />
    </ListItem>
  );
}
