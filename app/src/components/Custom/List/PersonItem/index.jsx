import React, { useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useCallback } from 'react';
import styles from './PersonItem.module.css';
import { ListItemSecondaryAction } from '@material-ui/core';

export default function PersonItem(props) {
  const { t } = useTranslation();

  const {
    id,
    onClick,
    selected,
    photoUrl,
    name,
    completeName,
    secondary,
    icon,
    inverseColor,
    secondaryActions, //secondaryAction is an array of components, this array should not contain more than 2 or 3 buttons
    notClickable,
  } = props;

  const initials = useMemo(
    () => getInitialsFromName(completeName || name),
    [completeName, name],
  );

  const handleClick = useCallback(
    e => {
      if (onClick) {
        if (completeName) {
          onClick(e, { id, completeName });
        } else {
          onClick(e, { id, name });
        }
      } else {
        goTo(ROUTES.entity, { id });
      }
    },
    [id, onClick],
  );
  return (
    <ListItem
      button
      selected={selected}
      onClick={notClickable ? null : handleClick}
      style={{
        width: '100%',
        secondaryAction: {
          paddingRight: 96,
        },
      }}
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
      <ListItemSecondaryAction>
        {secondaryActions ? (
          <div className={styles.secondaryActions}>
            {secondaryActions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </ListItemSecondaryAction>
      <ListItemText
        className={styles.text}
        primary={completeName || name}
        secondary={secondary || t('person')}
      ></ListItemText>
    </ListItem>
  );
}
