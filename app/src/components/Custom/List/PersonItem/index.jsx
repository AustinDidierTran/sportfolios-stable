import React, { useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useCallback } from 'react';
import styles from './PersonItem.module.css';

export default function PersonItem(props) {
  const { t } = useTranslation();

  const {
    id,
    onClick,
    selected,
    photoUrl,
    name,
    surname,
    secondary,
    icon,
    inverseColor,
  } = props;

  const completeName = useMemo(
    () => (surname ? `${name} ${surname}` : name),
    [name, surname],
  );

  const initials = useMemo(() => getInitialsFromName(completeName), [
    completeName,
  ]);

  const handleClick = useCallback(
    e => {
      if (onClick) {
        onClick(e, { id, name, surname });
      } else {
        goTo(ROUTES.entity, { id });
      }
    },
    [id, onClick],
  );

  return (
    <ListItem
      button
      onClick={handleClick}
      selected={selected}
      style={{ width: '100%' }}
    >
      <ListItemIcon>
        {inverseColor ? (
          <Avatar
            className={styles.avatar}
            photoUrl={photoUrl}
            icon={icon}
            initials={initials}
          ></Avatar>
        ) : (
          <Avatar
            photoUrl={photoUrl}
            icon={icon}
            initials={initials}
          ></Avatar>
        )}
      </ListItemIcon>
      <ListItemText
        primary={completeName}
        secondary={secondary || t('person')}
      ></ListItemText>
    </ListItem>
  );
}
