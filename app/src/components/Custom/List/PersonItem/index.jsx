import React, { useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';

export default function PersonItem(props) {
  const { t } = useTranslation();

  const {
    onClick = () => {},
    selected,
    photo_url,
    name,
    surname,
  } = props;

  const completeName = useMemo(
    () => (surname ? `${name} ${surname}` : name),
    [name, surname],
  );

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
      <ListItemText
        primary={completeName}
        secondary={t('person')}
      ></ListItemText>
    </ListItem>
  );
}
