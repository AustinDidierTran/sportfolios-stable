import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../../../../common/utils/stringFormat';
import { Card, ListItemText } from '../../../MUI';
import styles from './CartSummary.module.css';

export default function CartSummary(props) {
  const {
    total: { taxes, subtotal, total },
  } = props;

  const { t } = useTranslation();
  return (
    <Card margin>
      <div className={styles.div}>
        <ListItemText
          primary={t('subtotal')}
          className={styles.primary}
        />
        <ListItemText secondary={`${formatPrice(subtotal)} $`} />
      </div>
      {taxes.map(t => (
        <div className={styles.div}>
          <ListItemText
            className={styles.primary}
            primary={`${t.displayName} (${t.percentage}%)`}
          />
          <ListItemText secondary={`${formatPrice(t.amount)} $`} />
        </div>
      ))}
      <div className={styles.div}>
        <ListItemText
          primary={t('total')}
          className={styles.primary}
        />
        <ListItemText secondary={`${formatPrice(total)} $`} />
      </div>
    </Card>
  );
}
