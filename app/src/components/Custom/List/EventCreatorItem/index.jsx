import React, { useCallback, useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function EventCreatorItem(props) {
  const { t } = useTranslation();
  const { id, onClick, selected, photoUrl, name } = props;

  const initials = useMemo(() => getInitialsFromName(name), [name]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      goTo(ROUTES.entity, { id });
    }
  }, [id, onClick]);

  return (
    <ListItem
      button
      onClick={handleClick}
      selected={selected}
      style={{ width: '100%' }}
    >
      <ListItemIcon>
        <Avatar photoUrl={photoUrl} initials={initials}></Avatar>
      </ListItemIcon>
      <ListItemText
        primary={name}
        secondary={t('event_creator')}
      ></ListItemText>
    </ListItem>
  );
}
