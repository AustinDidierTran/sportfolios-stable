import React from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Icon } from '../..';

export default function DefaultItem(props) {
  const { onClick, selected, iconComponent, icon, value } = props;

  return (
    <ListItem
      button
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
      <ListItemText primary={value}></ListItemText>
    </ListItem>
  );
}
