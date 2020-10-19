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
  const { players, role, rosterId, onDelete, onAdd, update } = props;
  const [blackList, setBlackList] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    getBlackList();
  }, [rosterId]);

  const getBlackList = async () => {
    const { data } = await api(
      formatRoute('/api/entity/getRosterWithSub', null, { rosterId }),
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
    await getBlackList();
    setisLoading(false);
  };

  if (!players) {
    return null;
  }
  if (role === ROSTER_ROLE_ENUM.CAPTAIN) {
    return (
      <div className={styles.card}>
        <div className={styles.searchList}>
          <PersonSearchList
            clearOnSelect={false}
            blackList={blackList}
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
        {isLoading ? (
          <LoadingSpinner isComponent />
        ) : (
          <>
            {players.length ? (
              <div className={styles.player}>
                {players.map(player => (
                  <PlayerCard
                    player={player}
                    role={role}
                    onDelete={handleDelete}
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
  if (role === ROSTER_ROLE_ENUM.PLAYER) {
    return (
      <div className={styles.card}>
        <div className={styles.player}>
          {players.map(player => {
            return (
              <PlayerCard
                player={player}
                role={role}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
