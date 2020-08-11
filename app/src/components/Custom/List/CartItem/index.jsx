import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import Chip from '@material-ui/core/Chip';
import styles from './CartItem.module.css';
import { formatPrice } from '../../../../utils/stringFormats';
import { IMAGE_ENUM } from '../../../../../../common/enums';

export default function CartItem(props) {
  const { t } = useTranslation();

  const {
    metadata: { size, team },
    amount,
    description,
    label,
    photoUrl,
    quantity,
  } = props;
  if (team) {
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
            label={t('in_cart')}
            color="primary"
            variant="outlined"
            className={styles.chip}
          />
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
          secondary={size}
        ></ListItemText>
        <ListItemText
          className={styles.quantity}
          primary={formatPrice(amount)}
          secondary={`Qt: ${quantity}`}
        ></ListItemText>
        <Chip
          label={t('in_cart')}
          color="primary"
          variant="outlined"
          className={styles.chip}
        />
      </div>
    </ListItem>
  );
}
