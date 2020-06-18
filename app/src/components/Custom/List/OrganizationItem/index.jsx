import React, { useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';

export default function OrganizationItem(props) {
  const { t } = useTranslation();
  const { onClick = () => {}, selected, photo_url, name } = props;

  const initials = useMemo(() => getInitialsFromName(name), [name]);

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
        primary={name}
        secondary={t('organization')}
      ></ListItemText>
    </ListItem>
  );
}
