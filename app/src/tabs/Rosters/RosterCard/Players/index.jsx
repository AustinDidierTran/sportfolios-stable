import React, { useEffect, useState } from 'react';
import styles from './Players.module.css';

import { useTranslation } from 'react-i18next';
import { ROSTER_ROLE_ENUM } from '../../../../../../common/enums';
import uuid from 'uuid';

import PlayerCard from './PlayerCard';
import { Typography } from '@material-ui/core';
import {
  LoadingSpinner,
  PersonSearchList,
} from '../../../../components/Custom';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';

export default function Players(props) {
  const { t } = useTranslation();
  const {
    isEventAdmin,
    editableRole,
    editableRoster,
    whiteList,
    players,
    role,
    rosterId,
    onDelete,
    onAdd,
    onRoleUpdate,
    update,
  } = props;
  const [blackList, setBlackList] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  if (isEventAdmin || editableRoster) {
    useEffect(() => {
      getBlackList();
    }, [rosterId]);
  }

  const getBlackList = async () => {
    const { data } = await api(
      formatRoute('/api/entity/getRoster', null, {
        rosterId,
        withSub: true,
      }),
    );
    setBlackList(data.map(d => d.personId));
  };

  const onPlayerAddToRoster = async person => {
    setisLoading(true);
    const player = person.id
      ? {
          personId: person.id,
          name: person.completeName || person.name,
          id: uuid.v1(),
        }
      : { name: person.completeName || person.name, id: uuid.v1() };

    await onAdd(player, rosterId);
    setBlackList([...blackList, player.personId]);
    setisLoading(false);
  };

  const handleClose = async person => {
    setisLoading(true);
    await update();
    setBlackList([...blackList, person.id]);
    setisLoading(false);
  };
  const handleDelete = async id => {
    setisLoading(true);
    await onDelete(id);
    //TODO: handle blacklist in frontend and backend
    await getBlackList();
    setisLoading(false);
  };

  const handleRoleUpdate = async (playerId, role) => {
    setisLoading(true);
    await onRoleUpdate(playerId, role);
    setisLoading(false);
  };
  if (!players) {
    return null;
  }

  return (
    <div className={styles.card}>
      {isEventAdmin || editableRoster ? (
        <div className={styles.searchList}>
          <PersonSearchList
            addedByEventAdmin={
              isEventAdmin && role !== ROSTER_ROLE_ENUM.CAPTAIN //TODOV check for removing role
            }
            clearOnSelect={false}
            blackList={blackList}
            whiteList={whiteList}
            label={t('enter_player_name')}
            onClick={onPlayerAddToRoster}
            secondary={t('player')}
            allowCreate
            withoutIcon
            autoFocus
            rosterId={rosterId}
            handleClose={handleClose}
          />
        </div>
      ) : null}
      {isLoading ? (
        <LoadingSpinner isComponent />
      ) : (
        <>
          {players.length ? (
            <div className={styles.player}>
              {players.map(player => (
                <PlayerCard
                  isEventAdmin={isEventAdmin}
                  player={player}
                  isEditable={editableRole}
                  onDelete={handleDelete}
                  onRoleUpdate={handleRoleUpdate}
                  key={player.id}
                />
              ))}
            </div>
          ) : (
            <Typography>{t('empty_roster_add_players')}</Typography>
          )}
        </>
      )}
    </div>
  );
}
