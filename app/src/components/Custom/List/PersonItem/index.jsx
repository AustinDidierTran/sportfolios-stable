import React, { useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../../../Custom';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useCallback } from 'react';

export default function PersonItem(props) {
  const { t } = useTranslation();

  const { id, onClick, selected, photoUrl, name, surname } = props;

  const completeName = useMemo(
    () => (surname ? `${name} ${surname}` : name),
    [name, surname],
  );

  const initials = useMemo(() => getInitialsFromName(completeName), [
    completeName,
  ]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(id);
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
        primary={completeName}
        secondary={t('person')}
      ></ListItemText>
    </ListItem>
  );
}
