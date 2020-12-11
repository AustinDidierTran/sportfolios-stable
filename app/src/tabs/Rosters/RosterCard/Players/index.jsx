import React, { useContext, useEffect, useState } from 'react';
import styles from './Players.module.css';

import { useTranslation } from 'react-i18next';
import uuid from 'uuid';

import PlayerCard from './PlayerCard';
import { Divider, Typography } from '@material-ui/core';
import {
  List,
  LoadingSpinner,
  PersonSearchList,
  Button,
} from '../../../../components/Custom';
import api from '../../../../actions/api';
import { formatRoute } from '../../../../actions/goTo';
import { Store } from '../../../../Store';
import { GLOBAL_ENUM } from '../../../../../../common/enums';

export default function Players(props) {
  const {
    state: { userInfo },
  } = useContext(Store);
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
  if (isEventAdmin || editableRoster || withMyPersonsQuickAdd) {
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
    console.log({ person });
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
  console.log({ blackList });
  console.log({
    persons: userInfo.persons.filter(
      p => !blackList.includes(p.entity_id),
    ),
  });

  return (
    <div className={styles.card}>
      {isEventAdmin || editableRoster ? (
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
      ) : null}
      {isLoading ? (
        <LoadingSpinner isComponent />
      ) : (
        <>
          {withMyPersonsQuickAdd ? (
            <>
              <Typography align="left" variant="subtitle1">
                Vos personnes
              </Typography>
              <List
                items={userInfo.persons
                  .filter(p => !blackList.includes(p.entity_id))
                  .map(p => ({
                    ...p,
                    type: GLOBAL_ENUM.PERSON,
                    completeName: p.name + ' ' + p.surname,
                    secondaryActions: [
                      <Button
                        endIcon="Add"
                        onClick={() =>
                          onPlayerAddToRoster({
                            id: p.entity_id,
                            name: p.name,
                          })
                        }
                      >
                        {t('add')}
                      </Button>,
                    ],
                    notClickable: true,
                  }))}
              />
              <Divider variant="middle" />
            </>
          ) : (
            <></>
          )}
          {players.length ? (
            <div className={styles.player}>
              <Typography align="left" variant="subtitle2">
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
      )}
    </div>
  );
}
