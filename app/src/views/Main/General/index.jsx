import React, { useState, useEffect } from 'react';

import styles from './General.module.css';

import UpcomingEvents from './UpcomingEvents';
import api from '../../../actions/api';
import { formatRoute } from '../../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../../common/enums';

const getAllEvents = async () => {
  const { data } = await api(
    formatRoute('/api/entity/all', null, {
      type: GLOBAL_ENUM.EVENT,
    }),
  );
  return data || [];
};

export default function General() {
  const [events, setEvents] = useState([]);

  const getData = async () => {
    const events = await getAllEvents();
    setEvents(events);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.general}>
      {events.map(e => (
        <UpcomingEvents eventId={e.id} />
      ))}
    </div>
  );
}
