import React, { useState } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Icon, IconButton } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import api from '../../../../actions/api';
import { Radio } from '@material-ui/core';
import { formatRoute } from '../../../../actions/goTo';
import { AlertDialog } from '../../Dialog';

export default function CreditCardItem(props) {
  const { t } = useTranslation();
  const { last4, createdAt, isDefault, customerId, update } = props;
  const [openDelete, setOpenDelete] = useState(false);

  const onChange = async () => {
    await api('/api/stripe/defaultCreditCard', {
      method: 'PUT',
      body: JSON.stringify({
        customerId,
      }),
    });
    update();
  };

  const onDelete = async () => {
    await api(
      formatRoute('/api/stripe/creditCard', null, { customerId }),
      {
        method: 'DELETE',
      },
    );
    update();
  };

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <ListItemIcon>
          <Icon icon="CreditCard" />
        </ListItemIcon>
        <ListItemText
          primary={`**** **** **** ${last4}`}
          secondary={`${t('created_on')} ${formatDate(
            moment(createdAt),
          )}`}
        />
        <ListItemText
          secondary={t('default')}
          style={{ textAlign: 'end', margin: '4px' }}
        />
        <Radio
          checked={isDefault}
          label={t('default')}
          color="primary"
          onClick={onChange}
        />
        <IconButton
          icon="Delete"
          onClick={() => {
            setOpenDelete(true);
          }}
          style={{ color: 'grey' }}
          tooltip={t('delete')}
        />
      </ListItem>
      <AlertDialog
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
        }}
        onSubmit={onDelete}
        title={t('delete_credit_card_confirmation', { last4 })}
      />
    </>
  );
}
