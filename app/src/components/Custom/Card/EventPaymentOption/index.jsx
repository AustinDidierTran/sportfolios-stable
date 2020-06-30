import React from 'react';

import { Button, Paper, List } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../../common/enums';

export default function EventPaymentOption(props) {
  const { option, fields, onDelete } = props;
  const { t } = useTranslation();

  const paymentOptionId = option[4];

  const items = fields.map(f => ({
    display: f.display,
    value: option[f.value],
    helperText: f.helperText,
    type: GLOBAL_ENUM.PAYMENT_OPTION,
  }));

  return (
    <Paper>
      <List items={items}></List>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        endIcon="Delete"
        style={{ margin: '8px' }}
        onClick={() => {
          onDelete(paymentOptionId);
        }}
      >
        {t('delete')}
      </Button>
    </Paper>
  );
}
