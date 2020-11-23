import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Icon } from '../..';
import { ListItemSecondaryAction } from '@material-ui/core';

export default function DefaultItem(props) {
  const {
    onClick,
    selected,
    iconComponent,
    icon,
    value,
    secondaryAction,
    description,
  } = props;

  return (
    <ListItem
      button={Boolean(onClick)}
      onClick={onClick}
      selected={selected}
      style={{ width: '100%' }}
    >
      {iconComponent ? (
        <ListItemIcon>{iconComponent}</ListItemIcon>
      ) : (
        <ListItemIcon>
          <Icon icon={icon}></Icon>
        </ListItemIcon>
      )}
      <ListItemText
        primary={value}
        secondary={description}
      ></ListItemText>
      <ListItemSecondaryAction>
        <>{secondaryAction}</>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
