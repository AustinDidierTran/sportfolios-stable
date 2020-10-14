import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';
import { useTranslation } from 'react-i18next';
import {
  formatPrice,
  formatDate,
} from '../../../../utils/stringFormats';

import moment from 'moment';

export default function PaymentOptionItem(props) {
  const { t } = useTranslation();
  const { display, value, helperText } = props;
  const format = 'LLL';
  return (
    <ListItem>
      {display ? (
        <>
          {display === t('price') ? (
            <ListItemText
              style={{ margin: '0px' }}
              primary={`${formatPrice(value)}`}
              secondary={display}
            ></ListItemText>
          ) : (
            <ListItemText
              style={{ margin: '0px' }}
              primary={value}
              secondary={display}
            ></ListItemText>
          )}
        </>
      ) : (
        <ListItemText
          style={{ margin: '0px' }}
          primary={formatDate(moment(value), format)}
          secondary={helperText}
        ></ListItemText>
      )}
    </ListItem>
  );
}
