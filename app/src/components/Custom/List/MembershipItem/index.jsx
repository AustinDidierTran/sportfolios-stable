import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';

import { Button } from '../../../Custom';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useTranslation } from 'react-i18next';
import styles from './MembershipItem.module.css';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { grey } from '@material-ui/core/colors';

export default function MembershipItem(props) {
  const { t } = useTranslation();

  const {
    name,
    isMember,
    entity_id,
    person_id,
    membership_type,
    expirationDate,
  } = props;

  return (
    <ListItem style={{ width: '100%' }}>
      {isMember ? (
        <>
          <ListItemIcon style={{ minWidth: '35px' }}>
            <FiberManualRecordIcon color="primary" />
          </ListItemIcon>
          {window.innerWidth < 600 ? (
            <ListItemText
              secondaryTypographyProps={{ color: 'primary' }}
              primary={name}
              secondary={
                <div>
                  <div>{t('valid_until')}:</div>
                  <div>{expirationDate.format('LL')}</div>
                </div>
              }
            ></ListItemText>
          ) : (
            <ListItemText
              secondaryTypographyProps={{ color: 'primary' }}
              primary={name}
              secondary={`${t('valid_until')}:
              ${expirationDate.format('LL')}`}
            ></ListItemText>
          )}

          <Button
            className={styles.button}
            onClick={() => {
              goTo(ROUTES.memberships, null, {
                entity_id,
                person_id,
                membership_type,
              });
            }}
          >
            {t('renew_membership')}
          </Button>
        </>
      ) : (
        <>
          <ListItemIcon style={{ minWidth: '35px' }}>
            <FiberManualRecordIcon style={{ color: grey[500] }} />
          </ListItemIcon>
          <ListItemText primary={name}></ListItemText>

          <Button
            className={styles.button}
            onClick={() => {
              goTo(ROUTES.memberships, null, {
                entity_id,
                person_id,
                membership_type,
              });
            }}
          >
            {t('become_member')}
          </Button>
        </>
      )}
    </ListItem>
  );
}
