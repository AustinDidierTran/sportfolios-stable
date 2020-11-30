import React, { useMemo, useContext } from 'react';
import { Select, IconButton } from '../../../Custom';
import { ListItem, ListItemIcon, Typography } from '../../../MUI';
import { Avatar } from '../..';
import { getInitialsFromName } from '../../../../utils/stringFormats/index';
import { useTranslation } from 'react-i18next';
import {
  ROSTER_ROLE_ENUM,
  SEVERITY_ENUM,
} from '../../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../Store';

import styles from './RosterItem.module.css';

export default function RosterItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const {
    personId,
    photoUrl,
    name,
    surname,
    onDelete,
    index,
    formik,
  } = props;
  const initials = useMemo(() => getInitialsFromName(name), [name]);
  const { roster } = formik.values;

  const handleRoleChange = newRole => {
    if (
      newRole === ROSTER_ROLE_ENUM.PLAYER &&
      !roster.some(
        p =>
          p.role !== ROSTER_ROLE_ENUM.PLAYER &&
          p.personId !== personId,
      )
    ) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      formik.setFieldValue(`roster[${index}].role`, newRole);
    }
  };

  const RoleSelect = (
    <div>
      <Select
        className={styles.select}
        value={roster[index].role}
        onChange={newRole => handleRoleChange(newRole)}
        options={[
          {
            display: t('coach'),
            value: ROSTER_ROLE_ENUM.COACH,
          },
          {
            display: t('captain'),
            value: ROSTER_ROLE_ENUM.CAPTAIN,
          },
          {
            display: t('assistant_captain'),
            value: ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN,
          },
          {
            display: t('player'),
            value: ROSTER_ROLE_ENUM.PLAYER,
          },
        ]}
      />
    </div>
  );

  return (
    <ListItem className={styles.item}>
      <ListItemIcon>
        <Avatar photoUrl={photoUrl} initials={initials}></Avatar>
      </ListItemIcon>
      <div className={styles.text}>
        <Typography>{`${name}${
          surname ? ` ${surname}` : ''
        }`}</Typography>
        {RoleSelect}
      </div>
      <IconButton
        icon="Delete"
        style={{ color: 'grey' }}
        tooltip={t('remove')}
        edge="end"
        onClick={onDelete}
      />
    </ListItem>
  );
}
