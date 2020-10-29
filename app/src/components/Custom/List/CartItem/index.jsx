import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar, Select } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import styles from './CartItem.module.css';
import { formatPrice } from '../../../../utils/stringFormats';
import {
  GLOBAL_ENUM,
  IMAGE_ENUM,
} from '../../../../../../common/enums';
import { Divider } from '@material-ui/core';

export default function CartItem(props) {
  const { t } = useTranslation();

  const {
    id,
    metadata,
    amount,
    description,
    label,
    photoUrl,
    quantity,
    updateQuantity,
  } = props;
  const quantityOptions = Array(Math.max(101, quantity + 1))
    .fill(0)
    .map((_, index) => ({
      value: index,
      display: index,
    }));
  const { type } = metadata;
  if (type === GLOBAL_ENUM.TEAM || type === GLOBAL_ENUM.EVENT) {
    const { team } = metadata;
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
            ></ListItemText>
            <ListItemText
              className={styles.quantity}
              primary={formatPrice(amount)}
              secondary={label}
            ></ListItemText>
          </div>
        </ListItem>
        <Divider />
      </>
    );
  }
  if (type === GLOBAL_ENUM.MEMBERSHIP) {
    const { person, organization } = metadata;
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
              secondary={`Qt: ${quantity}`}
            ></ListItemText>
            <Select
              className={styles.select}
              onChange={value => {
                updateQuantity(value, id);
              }}
              value={quantity}
              options={quantityOptions}
              label={t('quantity')}
            />
          </div>
        </ListItem>
        <Divider />
      </>
    );
  }
  return <></>;
}
