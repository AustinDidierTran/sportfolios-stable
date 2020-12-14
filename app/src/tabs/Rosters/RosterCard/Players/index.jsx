import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './Players.module.css';

import { useTranslation } from 'react-i18next';
import uuid from 'uuid';

import PlayerCard from './PlayerCard';
import { Typography, Divider } from '@material-ui/core';
import {
  LoadingSpinner,
  PersonSearchList,
} from '../../../../components/Custom';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import PlayersQuickAdd from './PlayersQuickAdd';
import { Store } from '../../../../Store';
import { ROSTER_ROLE_ENUM } from '../../../../../../common/enums';

export default function Players(props) {
  const { t } = useTranslation();
  const {
    isEventAdmin,
    editableRole,
    editableRoster,
    whiteList,
    withMyPersonsQuickAdd,
    players,
    rosterId,
    onDelete,
    onAdd,
    onRoleUpdate,
    update,
  } = props;
  const [blackList, setBlackList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const {
    state: { userInfo },
  } = useContext(Store);
  useEffect(() => {
    getBlackList();
  }, [rosterId, isEventAdmin, editableRoster, withMyPersonsQuickAdd]);

  const getBlackList = async () => {
    if (isEventAdmin || editableRoster || withMyPersonsQuickAdd) {
      const { data } = await api(
        formatRoute('/api/entity/getRoster', null, {
          rosterId,
          withSub: true,
        }),
      );
      setBlackList(data.map(d => d.personId));
    }
  };

  const onPlayerAddToRoster = async person => {
    console.log({ person });
    setisLoading(true);
    const player = person.id
      ? {
          personId: person.id,
          name: person.completeName || person.name,
          id: uuid.v1(),
          role: ROSTER_ROLE_ENUM.PLAYER,
          isSub: false,
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
  const playersQuickAdd = useMemo(() => {
    if (withMyPersonsQuickAdd) {
      return userInfo.persons.filter(
        p => !blackList.includes(p.entity_id),
      );
    }
  }, [blackList]);

  if (!players) {
    return null;
  }
  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  if (isEventAdmin || editableRoster) {
    return (
      <div className={styles.card}>
        <div className={styles.searchList}>
          <PersonSearchList
            addedByEventAdmin={isEventAdmin && !editableRoster}
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
        <PlayersQuickAdd
          title={t('my_persons')}
          onAdd={onPlayerAddToRoster}
          persons={playersQuickAdd}
        />
        <Divider variant="middle" />
        <>
          {players.length ? (
            <div className={styles.player}>
              <Typography align="left" variant="subtitle1">
                {t('roster')}
              </Typography>
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
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <PlayersQuickAdd
        title={t('my_persons')}
        onAdd={onPlayerAddToRoster}
        persons={playersQuickAdd}
      />
      <Divider variant="middle" />
      {
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
      }
    </div>
  );
}
