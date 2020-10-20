import React, { useEffect, useState } from 'react';

import styles from './EditRosters.module.css';

import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { useParams } from 'react-router-dom';

import MyRosterCard from '../Rosters/MyRosterCard';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/Custom';
import { Typography } from '../../components/MUI';

const getRosters = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/allTeamsRegisteredInfos', null, {
      eventId,
    }),
  );
  return data;
};

export default function EditRosters() {
  const { id: eventId } = useParams();
  const { t } = useTranslation();
  const [rosters, setRosters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(0);

  const getData = async () => {
    const rosters = await getRosters(eventId);
    const rostersUpdated = rosters.map(roster => ({
      ...roster,
      //position: position from db here,
    }));
    setRosters(rostersUpdated);
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!rosters.length) {
    return (
      <Typography color="textSecondary" style={{ margin: '16px' }}>
        {t('there_is_no_rosters_for_this_event')}
      </Typography>
    );
  }

  return (
    <div className={styles.contain}>
      <div className={styles.rosters}>
        <div className={styles.contain}>
          {rosters.map((roster, index) => {
            return (
              <MyRosterCard
                isEventAdmin
                roster={roster}
                expandedIndex={expandedIndex}
                setExpandedIndex={setExpandedIndex}
                index={index + 1}
                key={roster.rosterId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
