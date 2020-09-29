import React, { useState } from 'react';
import EditGames from './EditGames';
import { useEffect } from 'react';
import api from '../../actions/api';
import { useParams } from 'react-router-dom';
import CreateSchedule from './CreateSchedule';

export default function EditScheduleTab() {
  const { id: eventId } = useParams();
  const [updated, setUpdated] = useState(true);

  useEffect(() => {
    addRegisteredTeams();
  }, []);

  const addRegisteredTeams = async () => {
    await api('/api/entity/addRegisteredToSchedule', {
      method: 'POST',
      body: JSON.stringify({
        eventId,
      }),
    });
  };

  const update = () => {
    setUpdated(!updated);
  };

  return (
    <>
      <CreateSchedule update={update} />
      <EditGames updated={updated} />
    </>
  );
}
