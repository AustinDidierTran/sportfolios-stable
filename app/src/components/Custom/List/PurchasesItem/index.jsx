import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import Chip from '@material-ui/core/Chip';
import styles from './PurchasesItem.module.css';
import MailtoButton from '../../MailToButton';
import { formatPrice } from '../../../../utils/stringFormats';

export default function PurchasesItem(props) {
  const { t } = useTranslation();

  const {
    photoUrl,
    createdAt,
    label,
    amount,
    metadata,
    quantity,
    email,
  } = props;

  return (
    <ListItem button style={{ width: '100%' }}>
      <ListItemIcon>
        <Avatar photoUrl={photoUrl} variant="square"></Avatar>
      </ListItemIcon>
      <div className={styles.div}>
        <ListItemText
          className={styles.text}
          primary={label}
          secondary={metadata.size}
        ></ListItemText>
        <ListItemText
          className={styles.text}
          primary={`Qt: ${quantity}`}
          secondary={formatPrice(amount)}
        ></ListItemText>
        <Chip
          label={t('ordered')}
          color="primary"
          variant="outlined"
        />
        <MailtoButton edge="end" emails={email} />
      </div>
      <ListItemText
        className={styles.text}
        color="textSecondary"
        primary={`${t('purchased_on')}: ${createdAt}`}
        secondary={formatPrice(amount)}
      ></ListItemText>
    </ListItem>
  );
}
