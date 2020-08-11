import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import Chip from '@material-ui/core/Chip';
import styles from './PurchasesItem.module.css';
import MailtoButton from '../../MailToButton';
import {
  formatPrice,
  formatDate,
} from '../../../../utils/stringFormats';
import moment from 'moment';

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
      <div className={styles.div}>
        <ListItemIcon>
          <Avatar
            photoUrl={photoUrl}
            variant="square"
            className={styles.photo}
          ></Avatar>
        </ListItemIcon>
        <ListItemText
          className={styles.name}
          primary={label}
          secondary={t(metadata.size)}
        ></ListItemText>
        <ListItemText
          className={styles.quantity}
          primary={formatPrice(amount)}
          secondary={t('qt', { quantity })}
        ></ListItemText>
        <MailtoButton
          edge="end"
          emails={email}
          className={styles.mail}
        />
        <Chip
          label={t('ordered')}
          color="primary"
          variant="outlined"
          className={styles.chip}
        />
        <ListItemText
          className={styles.date}
          secondary={`${t('purchased_on')}: ${formatDate(
            moment(createdAt),
          )}`}
        ></ListItemText>
      </div>
    </ListItem>
  );
}
