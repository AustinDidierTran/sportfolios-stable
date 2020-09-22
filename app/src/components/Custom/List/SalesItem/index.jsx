import React, { useMemo } from 'react';
import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar, MailToButton } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import styles from './SalesItem.module.css';
import {
  formatPrice,
  formatDate,
} from '../../../../utils/stringFormats';
import moment from 'moment';
export default function SalesItem(props) {
  const { t } = useTranslation();

  const {
    photo_url: photoUrl,
    created_at: createdAt,
    label,
    amount,
    metadata,
    quantity,
    email,
  } = props;

  const emails = useMemo(() => [{ email }], [email]);

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
        {email ? (
          <ListItemText
            className={styles.quantity}
            secondary={`${t('by')}: ${email}`}
            className={styles.email}
          ></ListItemText>
        ) : (
          <></>
        )}

        <MailToButton emails={emails} className={styles.mail} />
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
