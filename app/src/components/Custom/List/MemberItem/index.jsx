import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';

import { useTranslation } from 'react-i18next';
import styles from './MemberItem.module.css';
import {
  formatDate,
  getMembershipName,
} from '../../../../utils/stringFormats';
import { IconButton } from '../..';
import moment from 'moment';
import { Divider } from '@material-ui/core';

export default function MemberItem(props) {
  const { t } = useTranslation();

  const { person, memberType, expirationDate } = props;

  return (
    <>
      <ListItem style={{ width: '100%' }} className={styles.listItem}>
        <ListItemText
          className={styles.item1}
          primary={`${person?.name} ${person?.surname}`}
        ></ListItemText>
        {moment(expirationDate) < moment() ? (
          <ListItemText
            secondaryTypographyProps={{ color: 'secondary' }}
            className={styles.item2}
            primary={t(getMembershipName(memberType))}
            secondary={`${t('expired_on')}
              ${formatDate(moment(expirationDate))}`}
          ></ListItemText>
        ) : (
          <ListItemText
            className={styles.item2}
            primary={t(getMembershipName(memberType))}
            secondary={`${t('valid_until')}
              ${formatDate(moment(expirationDate))}`}
          ></ListItemText>
        )}

        <IconButton
          className={styles.iconButton}
          variant="contained"
          icon="Edit"
          tooltip={t('edit')}
          onClick={() => {}}
          style={{ color: 'primary' }}
        />
      </ListItem>
      <Divider />
    </>
  );
}
