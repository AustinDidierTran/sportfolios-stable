import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './Events.module.css';
import { formatRoute } from '../../actions/goTo';
import { CARD_TYPE_ENUM } from '../../../../common/enums';
import Card from '../../components/Custom/Card';
import api from '../../actions/api';
import { useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';

export default function EditEvents() {
  const { t } = useTranslation();
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

  const getData = async () => {
    const events = await getEntityEvents();
    setEvents(events);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.div}>
      <div className={styles.general}>
        {events.length ? (
          <>
            {events.map((e, index) => (
              <Card
                type={CARD_TYPE_ENUM.EVENT}
                items={e}
                key={index}
              />
            ))}
          </>
        ) : (
          <Typography>
            {t('this_organization_has_no_events')}
          </Typography>
        )}
      </div>
    </div>
  );
}
