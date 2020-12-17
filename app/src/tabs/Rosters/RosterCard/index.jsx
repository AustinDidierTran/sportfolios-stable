import React, { useContext, useMemo } from 'react';
import styles from './RosterCard.module.css';
import { Paper, Icon, Avatar } from '../../../components/Custom';

import Players from './Players';
import { Typography } from '../../../components/MUI';
import Tag from '../Tag';
import {
  ROSTER_ROLE_ENUM,
  STATUS_ENUM,
  SEVERITY_ENUM,
} from '../../../../../common/enums';
import api from '../../../actions/api';
import { ACTION_ENUM, Store } from '../../../Store';
import { formatRoute } from '../../../actions/goTo';
import { useTranslation } from 'react-i18next';

const isEven = n => {
  return n % 2 == 0;
};

export default function RosterCard(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const {
    isEventAdmin,
    roster,
    expanded,
    onExpand: onExpandProp,
    whiteList,
    index = 0,
    update = () => {},
    withMyPersonsQuickAdd,
    editableRoster: editableRosterProp,
    editableRole: editableRoleProp,
  } = props;
  const {
    position,
    name,
    players,
    rosterId,
    role,
    registrationStatus,
  } = roster;

  const deletePlayerFromRoster = async id => {
    const res = await api(
      formatRoute('/api/entity/deletePlayerFromRoster', null, {
        id,
      }),
      {
        method: 'DELETE',
      },
    );

    if (res.status === STATUS_ENUM.FORBIDDEN) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_delete_paid_player'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    if (res.status === STATUS_ENUM.METHOD_NOT_ALLOWED) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    if (res.status === STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    return true;
  };

  const addPlayerToRoster = async player => {
    const res = await api(`/api/entity/addPlayerToRoster`, {
      method: 'POST',
      body: JSON.stringify({
        ...player,
        rosterId,
      }),
    });
    if (res.status === STATUS_ENUM.SUCCESS) {
      update();
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  const updatePlayerRole = async (playerId, role) => {
    const res = await api(`/api/entity/rosterRole`, {
      method: 'PUT',
      body: JSON.stringify({
        rosterId,
        playerId,
        role,
      }),
    });

    if (res.status === STATUS_ENUM.SUCCESS) {
      update();
    } else if (res.status === STATUS_ENUM.FORBIDDEN) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };
  function remainsOtherPlayerWithRole(teamPlayerId) {
    return roster.players.some(
      p =>
        p.id !== teamPlayerId && p.role !== ROSTER_ROLE_ENUM.PLAYER,
    );
  }
  const onDelete = async id => {
    if (!remainsOtherPlayerWithRole(id)) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('team_player_role_error'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }
    const refresh = await deletePlayerFromRoster(id);
    if (refresh) {
      update();
    }
  };

  const isTeamEditor = useMemo(
    () =>
      role == ROSTER_ROLE_ENUM.CAPTAIN ||
      role == ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ||
      role == ROSTER_ROLE_ENUM.COACH,
    [role],
  );
  const editableRoster = useMemo(
    () => editableRosterProp || isTeamEditor || isEventAdmin,
    [editableRosterProp, isTeamEditor, isEventAdmin],
  );
  const editableRole = useMemo(
    () => editableRoleProp || isTeamEditor || isEventAdmin,
    [editableRoleProp, isTeamEditor, isEventAdmin],
  );

  const onExpand = () => {
    onExpandProp(index);
  };

  const greenBackground =
    isEventAdmin || role != ROSTER_ROLE_ENUM.VIEWER;
  const style = useMemo(() => {
    if (greenBackground && isEven(index)) {
      return { backgroundColor: '#19bf9d', color: '#fff' };
    }
    if (greenBackground && !isEven(index)) {
      return { backgroundColor: '#18B393', color: '#fff' };
    }
    if (!greenBackground && isEven(index)) {
      return { backgroundColor: '#f2f2f2' };
    }
  }, [greenBackground, index]);

  return (
    <Paper className={styles.paper}>
      <div className={styles.card} style={style} onClick={onExpand}>
        <div className={styles.default}>
          <div className={styles.position}>{position || '-'}</div>
          <div className={styles.title}>
            <div className={styles.name}>
              <Typography>{name.toUpperCase()}</Typography>
            </div>
            <Avatar
              className={styles.avatar}
              photoUrl={roster.photoUrl}
              size="sm"
            />
          </div>
          <div className={styles.pod}>
            <Tag type={registrationStatus} />
          </div>
          <div className={styles.expand}>
            <Icon
              icon={
                expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'
              }
            />
          </div>
        </div>
      </div>
      <div className={styles.expanded} hidden={!expanded}>
        <Players
          withPlayersInfos={isEventAdmin}
          editableRoster={editableRoster}
          editableRole={editableRole}
          whiteList={whiteList}
          players={players}
          rosterId={rosterId}
          onDelete={onDelete}
          onAdd={addPlayerToRoster}
          onRoleUpdate={updatePlayerRole}
          withMyPersonsQuickAdd={withMyPersonsQuickAdd}
        />
      </div>
    </Paper>
  );
}
