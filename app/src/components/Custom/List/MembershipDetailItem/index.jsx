import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';

import { Button } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import styles from './MembershipDetailItem.module.css';
import {
  addMembership,
  getExpirationDate,
} from '../../../../utils/memberships';
import { updateMembership } from '../../../../utils/memberships';
import { formatPrice } from '../../../../utils/stringFormats';

export default function MembershipDetailItem(props) {
  const { t } = useTranslation();

  const {
    entityId,
    fixedDate,
    isMember,
    length,
    membershipType,
    personId,
    price,
    stripePriceId,
  } = props;

  const name = getMembershipName(membership_type);

  const expirationDate = () => {
    return getExpirationDate(length, fixed_date);
  };

  const clickBecomeMember = useCallback(async () => {
    await addMembership(personId, stripePriceId);
  }, [personId, stripePriceId]);

  const clickRenewMember = useCallback(async () => {
    const expirationDate = getExpirationDate(length, fixedDate);
    await updateMembership(
      membershipType,
      personId,
      entityId,
      expirationDate,
      stripePriceId,
    );
  });

  return (
    <ListItem style={{ width: '100%' }} className={styles.main}>
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
        primary={formatPrice(price)}
        secondary={t('price')}
      ></ListItemText>
      {isMember ? (
        <Button
          className={styles.button}
          onClick={() => clickRenewMember()}
        >
          {t('renew_membership')}
        </Button>
      ) : (
        <Button
          className={styles.button}
          onClick={() => clickBecomeMember()}
        >
          {t('become_member')}
        </Button>
      )}
    </ListItem>
  );
}
