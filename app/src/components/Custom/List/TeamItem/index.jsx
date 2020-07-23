import React, { useCallback, useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../..';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import styles from './TeamItem.module.css';

export default function TeamItem(props) {
  const { t } = useTranslation();

  const {
    id,
    secondary,
    onClick,
    selected,
    photoUrl,
    name,
    icon,
    inverseColor,
    notClickable,
  } = props;

  const initials = useMemo(() => getInitialsFromName(name), [name]);

  const handleClick = useCallback(
    e => {
      if (notClickable) {
        return;
      }
      if (onClick) {
        onClick(e, { id, name });
      } else {
        goTo(ROUTES.entity, { id });
      }
    },
    [id, onClick, name],
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
        primary={name}
        secondary={secondary || t('team')}
      ></ListItemText>
    </ListItem>
  );
}
