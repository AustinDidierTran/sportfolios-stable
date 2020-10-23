import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';

import { IconButton } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { Divider } from '@material-ui/core';
export default function MembershipOrganizationItem(props) {
  const { t } = useTranslation();

  const {
    membership,
    price,
    membershipType,
    expirationDate,
    onDelete,
    id,
  } = props;

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <ListItemText
          primary={`${membership} | ${price}$`}
          secondary={`${t(
            'expire_on',
          )} ${expirationDate} (${membershipType})`}
        ></ListItemText>
        <IconButton
          onClick={() => {
            onDelete(id);
          }}
          tooltip={t('delete')}
          icon="Delete"
          style={{ color: 'primary' }}
        />
      </ListItem>
      <Divider />
    </>
  );
}
