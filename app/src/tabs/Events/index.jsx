import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Custom';
import { useTranslation } from 'react-i18next';

import styles from './Events.module.css';
import { goTo, ROUTES, formatRoute } from '../../actions/goTo';
import {
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
  ENTITIES_ROLE_ENUM,
} from '../../../../common/enums';
import Card from '../../components/Custom/Card';
import api from '../../actions/api';
import { useParams } from 'react-router-dom';

export default function Events(props) {
  const { t } = useTranslation();
  const { basicInfos } = props;
  const [events, setEvents] = useState([]);
  const { id } = useParams();

  const getEntityEvents = async () => {
    const { data } = await api(
      formatRoute('/api/entity/ownedEvents', null, {
        organizationId: id,
      }),
    );
    return data || [];
  };

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

  if (basicInfos.role === ENTITIES_ROLE_ENUM.VIEWER) {
    return (
      <div className={styles.div}>
        <div className={styles.general}>
          {events.map(e => (
            <Card
              type={CARD_TYPE_ENUM.EVENT}
              items={{ eventId: e.id }}
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={styles.div}>
      <div className={styles.buttonDiv}>
        <Button onClick={handleClick} style={{ margin: 8 }}>
          {t('create_event')}
        </Button>
      </div>

      <div className={styles.general}>
        {events.map(e => (
          <Card
            type={CARD_TYPE_ENUM.EVENT}
            items={{ eventId: e.id }}
          />
        ))}
      </div>
    </div>
  );
}
