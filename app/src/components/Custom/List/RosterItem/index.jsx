import React, { useMemo } from 'react';

import { Icon } from '../../../Custom';
import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../..';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import styles from './RosterItem.module.css';

export default function RosterItem(props) {
  const { t } = useTranslation();

  const {
    id,
    person_id,
    secondary,
    photoUrl,
    name,
    onDelete,
  } = props;

  const initials = useMemo(() => getInitialsFromName(name), [name]);

  const handleDelete = () => {
    if (person_id) {
      onDelete({ person_id });
    } else {
      onDelete({ id });
    }
  };

  return (
    <ListItem button style={{ width: '100%' }}>
      <ListItemIcon>
        <Avatar photoUrl={photoUrl} initials={initials}></Avatar>
      </ListItemIcon>
      <ListItemText
        className={styles.text}
        primary={name}
        secondary={secondary || t('person')}
      ></ListItemText>
      <IconButton edge="end" onClick={handleDelete}>
        <Icon icon="Delete" />
      </IconButton>
    </ListItem>
  );
}
