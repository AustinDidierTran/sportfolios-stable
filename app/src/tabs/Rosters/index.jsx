import React, { useState, useEffect } from 'react';

import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { useParams } from 'react-router-dom';

import styles from './Rosters.module.css';

import MyRoster from './MyRoster';
import Rosters from './Rosters';
import { ENTITIES_ROLE_ENUM } from '../../Store';

const getRosters = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/allTeamsRegistered', null, {
      eventId,
    }),
  );
  return data;
};

export default function TabRosters() {
  const { id: eventId } = useParams();
  const [rosters, setRosters] = useState([]);
  const [myRoster, setMyRoster] = useState({});

  const getMyRoster = rosters => {
    //TODO: Now, only roster admins can see this, need to add players too.
    rosters.forEach((r, index) => {
      if (r.role == ENTITIES_ROLE_ENUM.ADMIN) {
        const myRoster = { ...rosters[index], position: index + 1 };
        setMyRoster(myRoster);
        return;
      }
    });
  };

  const getData = async () => {
    const rosters = await getRosters(eventId);
    setRosters(rosters);
    getMyRoster(rosters);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.contain}>
      <div className={styles.myRoster}>
        {myRoster && myRoster.name && <MyRoster roster={myRoster} />}
      </div>
      <div className={styles.rosters}>
        <Rosters rosters={rosters} />
      </div>
    </div>
  );
}
