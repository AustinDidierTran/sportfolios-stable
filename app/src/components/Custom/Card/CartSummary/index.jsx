import { CardActionArea } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, ListItemText } from '../../../MUI';
import styles from './CartSummary.module.css';

export default function CartSummary(props) {
  const {
    total: { taxes, total },
  } = props;
  const { t } = useTranslation();
  console.log({ total });
  console.log({ taxes });
  return (
    <Card>
      <CardActionArea>
        <div className={styles.div}>
          <ListItemText primary={t('subtotal')} />
          <ListItemText primary={`${total}$`} />
        </div>

        {taxes.map(t => (
          <div className={styles.div}>
            <ListItemText
              primary={`${t.displayName} (${t.percentage}%)`}
              secondary={t.description}
            />
            <ListItemText primary={`${t.amount}$`} />
          </div>
        ))}
      </CardActionArea>
    </Card>
  );
}
