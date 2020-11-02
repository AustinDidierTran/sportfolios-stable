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
import { Divider } from '@material-ui/core';

export default function PurchasesItem(props) {
  const { t } = useTranslation();

  const {
    photoUrl,
    created_at: createdAt,
    label,
    amount,
    metadata,
    quantity,
    description,
    receipt_url: receiptUrl,
    // email,
  } = props;
  const goToReceipt = () => {
    window.location.href = receiptUrl;
  };
  const { type } = metadata;
  if (type === GLOBAL_ENUM.EVENT) {
    const { team } = metadata;
    if (!team) {
      return <></>;
    }
    return (
      <>
        <ListItem style={{ width: '100%' }}>
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
              primary={description}
              secondary={team.name}
            />
            <ListItemText
              className={styles.quantity}
              primary={
                metadata?.isIndividualOption
                  ? `${formatPrice(amount)} - ${metadata?.name}`
                  : formatPrice(amount)
              }
              secondary={label}
            />
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
        <Divider />
      </>
    );
  }
  if (type === GLOBAL_ENUM.MEMBERSHIP) {
    const { organization, person } = metadata;
    return (
      <>
        <ListItem style={{ width: '100%' }}>
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
        <Divider />
      </>
    );
  }

  if (type === GLOBAL_ENUM.SHOP_ITEM) {
    const { size } = metadata;
    return (
      <>
        <ListItem style={{ width: '100%' }}>
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
              secondary={t(size) || ''}
            ></ListItemText>
            <ListItemText
              className={styles.quantity}
              primary={formatPrice(amount)}
              secondary={t('Qt', { quantity })}
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
        <Divider />
      </>
    );
  }
  return <></>;
}
