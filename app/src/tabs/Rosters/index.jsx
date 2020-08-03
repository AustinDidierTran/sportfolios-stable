import React, { useState, useEffect } from 'react';

import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { useParams } from 'react-router-dom';
import { ROSTER_ROLE_ENUM } from '../../../../common/enums';

import styles from './Rosters.module.css';

import MyRoster from './MyRoster';
import Rosters from './Rosters';

const getRosters = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/allTeamsRegistered', null, {
      eventId,
    }),
  );
  return data;
};

const deletePlayerFromRoster = async id => {
  await api(
    formatRoute('/api/entity/deletePlayerFromRoster', null, {
      id,
    }),
    {
      method: 'DELETE',
    },
  );
};

const addPlayerToRoster = async (player, rosterId) => {
  const { data } = await api(`/api/entity/addPlayerToRoster`, {
    method: 'POST',
    body: JSON.stringify({
      ...player,
      rosterId,
    }),
  });
  return data;
};

export default function TabRosters() {
  const { id: eventId } = useParams();
  const [rosters, setRosters] = useState([]);
  const [myRosters, setMyRosters] = useState([]);

  const onDelete = async id => {
    await deletePlayerFromRoster(id);
    await getData();
  };

  const onAdd = async (player, rosterId) => {
    await addPlayerToRoster(player, rosterId);
    await getData();
  };

  const getMyRosters = rosters => {
    const myRosters = rosters
      .filter(
        r =>
          r.role == ROSTER_ROLE_ENUM.CAPTAIN ||
          r.role == ROSTER_ROLE_ENUM.PLAYER,
      )
      .map((r, index) => {
        return { ...r, position: index + 1 };
      });
    setMyRosters(myRosters);
  };

  const getData = async () => {
    const rosters = await getRosters(eventId);
    const rostersUpdated = rosters.map((roster, index) => {
      return { ...roster, position: index + 1 };
    });
    setRosters(rostersUpdated);
    getMyRosters(rosters);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.contain}>
      <div className={styles.myRoster}>
        <MyRoster
          rosters={myRosters}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      </div>
      <div className={styles.rosters}>
        <Rosters rosters={rosters} />
      </div>
    </div>
  );
}
