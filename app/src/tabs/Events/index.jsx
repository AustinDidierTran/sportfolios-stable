import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Custom';
import { useTranslation } from 'react-i18next';

import styles from './Events.module.css';
import { goTo, ROUTES, formatRoute } from '../../actions/goTo';
import { GLOBAL_ENUM } from '../../../../common/enums';
import UpcomingEvents from '../../views/Main/General/UpcomingEvents';
import api from '../../actions/api';

const getEntityEvents = async () => {
  const { data } = await api(
    formatRoute('/api/entity/allOwned', null, {
      type: GLOBAL_ENUM.EVENT,
    }),
  );
  return data || [];
};

export default function Events(props) {
  const { t } = useTranslation();
  const { basicInfos } = props;
  const [events, setEvents] = useState([]);

  const handleClick = () => {
    goTo(ROUTES.create, null, {
      type: GLOBAL_ENUM.EVENT,
      id: basicInfos.id,
    });
  };

  const getData = async () => {
    const events = await getEntityEvents();
    setEvents(events);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.div}>
      <div className={styles.buttonDiv}>
        <Button onClick={handleClick} style={{ margin: 8 }}>
          {t('create_event')}
        </Button>
      </div>

      <div className={styles.general}>
        {events.map(e => (
          <UpcomingEvents eventId={e.id} />
        ))}
      </div>
    </div>
  );
}
