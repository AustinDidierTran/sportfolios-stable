import React, { useMemo } from 'react';

import { ListItem, ListItemText } from '../../../MUI';
import { IconButton } from '../../../Custom';
import { Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  formatDate,
  formatPrice,
} from '../../../../utils/stringFormats';
import moment from 'moment';

export default function EventPaymentOptionItem(props) {
  const { t } = useTranslation();
  const {
    id,
    name,
    price,
    start_time,
    end_time,
    onDelete,
    onEdit,
  } = props;

  const startDate = useMemo(() => formatDate(moment(start_time)), [
    start_time,
  ]);

  const endDate = useMemo(() => formatDate(moment(end_time)), [
    end_time,
  ]);

  return (
    <div>
      <ListItem>
        <ListItemText
          primary={`${name} | ${
            price === 0 ? t('free') : formatPrice(price)
          }`}
          secondary={t('open_from_to', {
            startDate,
            endDate,
          })}
        />
        <IconButton
          icon="Edit"
          onClick={() =>
            onEdit({ id, name, price, start_time, end_time })
          }
          style={{ color: 'primary' }}
          tooltip={t('edit')}
        />
        <IconButton
          icon="Delete"
          onClick={() => onDelete(id)}
          style={{ color: 'primary' }}
          tooltip={t('delete')}
        />
      </ListItem>
      <Divider />
    </div>
  );
}
