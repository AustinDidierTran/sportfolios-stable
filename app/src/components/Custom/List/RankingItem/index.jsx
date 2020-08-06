import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import styles from './RankingItem.module.css';

export default function RankingItem(props) {
  const { t } = useTranslation();

  const {
    id,
    index,
    name,
    wins,
    loses,
    pointFor,
    pointAgainst,
  } = props;
  console.log({
    id,
    index,
    name,
    wins,
    loses,
    pointFor,
    pointAgainst,
  });

  return (
    <ListItem style={{ width: '100%' }}>
      <ListItemIcon>
        <Avatar initials={index}></Avatar>
      </ListItemIcon>
      <ListItemText
        className={styles.text}
        primary={name}
        secondary={t('person')}
      ></ListItemText>
    </ListItem>
  );
}
