import React, { useState, useEffect, useContext } from 'react';

import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { useParams } from 'react-router-dom';

import styles from './Rosters.module.css';

import Rosters from './Rosters';
import { Typography } from '../../components/MUI';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../components/Custom';
import { STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { Store, ACTION_ENUM } from '../../Store';

const getRosters = async eventId => {
  const { data } = await api(
    formatRoute('/api/entity/allTeamsRegisteredInfos', null, {
      eventId,
    }),
  );
  return data;
};

const deletePlayerFromRoster = async (id, deletedByEventAdmin) => {
  const res = await api(
    formatRoute('/api/entity/deletePlayerFromRoster', null, {
      id,
      deletedByEventAdmin,
    }),
    {
      method: 'DELETE',
    },
  );

  if (res.status === STATUS_ENUM.ERROR) {
    dispatch({
      type: ACTION_ENUM.SNACK_BAR,
      message: t(
        "can't delete this player since he already paid. Contact event admin for help.",
      ),
      severity: SEVERITY_ENUM.ERROR,
      duration: 4000,
    });
  }
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

export default function TabRosters(props) {
  const { isEventAdmin } = props;
  const { id: eventId } = useParams();
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const [rosters, setRosters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const onDelete = async (id, deleteByAdmin) => {
    await deletePlayerFromRoster(id, deleteByAdmin);
    await getData();
  };

  const onAdd = async (player, rosterId) => {
    await addPlayerToRoster(player, rosterId);
    await getData();
  };

  const getData = async () => {
    const rosters = await getRosters(eventId);
    const rostersUpdated = rosters.map(roster => {
      const players = roster.players.filter(player => !player.isSub);
      return { ...roster, players };
    });
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
        <Rosters
          isEventAdmin={isEventAdmin}
          rosters={rosters}
          onAdd={onAdd}
          onDelete={onDelete}
          update={getData}
        />
      </div>
    </div>
  );
}
