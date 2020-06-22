import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';

import { Button } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import styles from './MembershipDetailItem.module.css';
import {
  getMembershipName,
  getMembershipLength,
  getMembershipUnit,
} from '../../../../utils/stringFormats';
import moment from 'moment';

export default function MembershipDetailItem(props) {
  const { t } = useTranslation();

  const {
    price,
    length,
    fixed_date,
    membership_type,
    handleClick,
    index,
  } = props;

  const name = getMembershipName(membership_type);

  const expirationDate = () => {
    if (length !== -1) {
      return moment()
        .add(getMembershipLength(length), getMembershipUnit(length))
        .format('LL');
    } else {
      return moment(fixed_date).format('LL');
    }
  };

  return (
    <ListItem style={{ width: '100%' }}>
      {window.innerWidth < 600 ? (
        <ListItemText
          secondaryTypographyProps={{ color: 'primary' }}
          primary={t(name)}
          secondary={
            <div>
              <div>{t('valid_until')}:</div>
              <div>{expirationDate()}</div>
            </div>
          }
        ></ListItemText>
      ) : (
        <ListItemText
          secondaryTypographyProps={{ color: 'primary' }}
          primary={t(name)}
          secondary={`${t('valid_until')}:  ${expirationDate()}`}
        ></ListItemText>
      )}
      <ListItemText
        className={styles.price}
        secondaryTypographyProps={{ color: 'primary' }}
        primary={`${price}$`}
        secondary={t('price')}
      ></ListItemText>
      <Button
        className={styles.button}
        onClick={() => handleClick(index)}
      >
        {t('become_member')}
      </Button>
    </ListItem>
  );
}
