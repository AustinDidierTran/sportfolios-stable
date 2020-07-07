import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';
import { useTranslation } from 'react-i18next';

import moment from 'moment';

export default function PaymentOptionItem(props) {
  const { t } = useTranslation();
  const { display, value, helperText } = props;

  return (
    <ListItem>
      {display ? (
        <>
          {display === t('price') ? (
            <ListItemText
              style={{ margin: '0px' }}
              primary={`${value / 100}$`}
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
          primary={moment(value).format('LL')}
          secondary={helperText}
        ></ListItemText>
      )}
    </ListItem>
  );
}
