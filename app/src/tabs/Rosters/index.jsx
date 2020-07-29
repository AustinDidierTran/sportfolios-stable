import React, { useState, useEffect } from 'react';

import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { useParams } from 'react-router-dom';

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

export default function TabRosters() {
  const { id: eventId } = useParams();
  const [rosters, setRosters] = useState([]);

  const getData = async () => {
    const rosters = await getRosters(eventId);
    setRosters(rosters);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.contain}>
      <div className={styles.myRoster}>
        <MyRoster
          roster={rosters[5]}
          position={5 + 1}
          initialExpanded
        />
      </div>
      <div className={styles.rosters}>
        <Rosters rosters={rosters} />
      </div>
    </div>
  );
}
