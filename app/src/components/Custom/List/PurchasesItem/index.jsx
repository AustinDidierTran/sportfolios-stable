import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar, IconButton } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import styles from './PurchasesItem.module.css';
// import MailtoButton from '../../MailToButton';
import {
  formatPrice,
  formatDate,
} from '../../../../utils/stringFormats';
import moment from 'moment';
import {
  GLOBAL_ENUM,
  IMAGE_ENUM,
} from '../../../../../../common/enums';

export default function PurchasesItem(props) {
  const { t } = useTranslation();

  const {
    photoUrl,
    created_at: createdAt,
    label,
    amount,
    metadata,
    quantity,
    receipt_url: receiptUrl,
    // email,
  } = props;
  const goToReceipt = () => {
    window.location.href = receiptUrl;
  };
  if (metadata.type === GLOBAL_ENUM.EVENT) {
    return (
      <ListItem button style={{ width: '100%' }}>
        <div className={styles.div}>
          <ListItemIcon>
            <Avatar
              photoUrl={photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
              variant="square"
              className={styles.photo}
            ></Avatar>
          </ListItemIcon>
          <ListItemText
            className={styles.name}
            primary={label}
            secondary={metadata.size}
          ></ListItemText>
          <ListItemText
            className={styles.quantity}
            primary={formatPrice(amount)}
          ></ListItemText>
          {/* <MailtoButton
            edge="end"
            emails={email}
            className={styles.mail}
          /> */}
          <IconButton
            onClick={goToReceipt}
            tooltip={t('receipt')}
            icon="Receipt"
            style={{ color: 'primary' }}
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
  if (metadata.type === GLOBAL_ENUM.MEMBERSHIP) {
    const { organization, person } = metadata;
    return (
      <ListItem button style={{ width: '100%' }}>
        <div className={styles.div}>
          <ListItemIcon>
            <Avatar
              photoUrl={
                organization?.photoUrl ||
                IMAGE_ENUM.ULTIMATE_TOURNAMENT
              }
              variant="square"
              className={styles.photo}
            ></Avatar>
          </ListItemIcon>
          <ListItemText
            className={styles.name}
            primary={t(label)}
            secondary={organization?.name}
          ></ListItemText>
          <ListItemText
            className={styles.quantity}
            primary={formatPrice(amount)}
            secondary={`${person?.name} ${person?.surname}`}
          ></ListItemText>
          <IconButton
            onClick={goToReceipt}
            tooltip={t('receipt')}
            icon="Receipt"
            style={{ color: 'primary' }}
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
        {/* <MailtoButton
          edge="end"
          emails={email}
          className={styles.mail}
        /> */}
        <IconButton
          onClick={goToReceipt}
          tooltip={t('receipt')}
          icon="Receipt"
          style={{ color: 'primary' }}
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
