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
import Chip from '@material-ui/core/Chip';

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
  const { type, size } = metadata;
  const quantityOptions = Array(Math.max(101, quantity + 1))
    .fill(0)
    .map((_, index) => ({
      value: index,
      display: index,
    }));
  if (type === GLOBAL_ENUM.TEAM) {
    const { team } = metadata;
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
            primary={description}
            secondary={team.name}
          ></ListItemText>
          <ListItemText
            className={styles.quantity}
            primary={formatPrice(amount)}
            secondary={label}
          ></ListItemText>
          <Chip
            label={t('registered')}
            color="primary"
            variant="outlined"
            className={styles.chip}
          />
        </div>
      </ListItem>
    );
  }
  if (type === GLOBAL_ENUM.MEMBERSHIP) {
    const { person, organization } = metadata;
    return (
      <ListItem button style={{ width: '100%' }}>
        <div className={styles.div}>
          <ListItemIcon>
            <Avatar
              photoUrl={
                organization.photoUrl ||
                IMAGE_ENUM.ULTIMATE_TOURNAMENT
              }
              variant="square"
              className={styles.photo}
            ></Avatar>
          </ListItemIcon>
          <ListItemText
            className={styles.name}
            primary={t(label)}
            secondary={description}
          ></ListItemText>
          <ListItemText
            className={styles.quantity}
            primary={formatPrice(amount)}
            secondary={`${person?.name} ${person?.surname}`}
          ></ListItemText>
        </div>
      </ListItem>
    );
  }
  if (type === GLOBAL_ENUM.EVENT) {
    const { team } = metadata;
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
            secondary={description}
          ></ListItemText>
          <ListItemText
            className={styles.quantity}
            primary={formatPrice(amount)}
            secondary={team.name}
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
          secondary={size || ''}
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
  );
}
