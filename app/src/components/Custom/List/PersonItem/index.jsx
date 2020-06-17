import React, { useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';

export default function PersonItem(props) {
  const {
    onClick = () => {},
    selected,
    photo_url,
    name,
    surname,
  } = props;

  const completeName = useMemo(() => `${name} ${surname}`, [
    name,
    surname,
  ]);

  const initials = useMemo(() => getInitialsFromName(completeName), [
    completeName,
  ]);

  return (
    <ListItem
      button
      onClick={onClick}
      selected={selected}
      style={{ width: '100%' }}
    >
      <ListItemIcon>
        <Avatar photoUrl={photo_url} initials={initials}></Avatar>
      </ListItemIcon>
      <ListItemText primary={completeName}></ListItemText>
    </ListItem>
  );
}
