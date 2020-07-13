import React, { useMemo } from 'react';

import { ListItem, ListItemIcon, ListItemText } from '../../../MUI';
import { Avatar } from '../..';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

export default function RosterItem(props) {
  const { t } = useTranslation();

  const {
    id,
    person_id,
    secondary,
    photoUrl,
    name,
    onDelete,
  } = props;

  const initials = useMemo(() => getInitialsFromName(name), [name]);

  const handleDelete = () => {
    if (person_id) {
      onDelete({ person_id });
    } else {
      onDelete({ id });
    }
  };

  return (
    <ListItem button style={{ width: '100%' }}>
      <ListItemIcon>
        <Avatar photoUrl={photoUrl} initials={initials}></Avatar>
      </ListItemIcon>
      <ListItemText
        primary={name}
        secondary={secondary || t('person')}
      ></ListItemText>
      <IconButton edge="end" onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}
