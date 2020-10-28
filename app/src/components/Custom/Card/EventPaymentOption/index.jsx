import React from 'react';

import { Button, Paper, List } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { LIST_ITEM_ENUM } from '../../../../../../common/enums';
import styles from './EventPaymentOption.module.css';

export default function EventPaymentOption(props) {
  const { option, fields, onDelete } = props;
  const { t } = useTranslation();

  const paymentOptionId = option[4];

  const arr = fields.filter(f => f.type != 'time');
  const items = arr.map((f, index) => ({
    display: f.display,
    value: option[index],
    helperText: f.helperText,
    type: LIST_ITEM_ENUM.PAYMENT_OPTION,
    key: index,
  }));

  return (
    <Paper>
      <div>
        <List items={items} />
        <Button
          size="small"
          variant="contained"
          color="secondary"
          endIcon="Delete"
          onClick={() => {
            onDelete(paymentOptionId);
          }}
          className={styles.button}
        >
          {t('delete')}
        </Button>
      </div>
    </Paper>
  );
}
