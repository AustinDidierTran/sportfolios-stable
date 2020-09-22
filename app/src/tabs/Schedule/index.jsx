import React, { useState } from 'react';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';
import Games from './Games';
import SubmitScore from './SubmitScore';
import { useEffect } from 'react';
import api from '../../actions/api';
import { useParams } from 'react-router-dom';
import CreateSchedule from './CreateSchedule';

export default function ScheduleTab(props) {
  const {
    basicInfos: { role },
  } = props;
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

  if (
    role === ENTITIES_ROLE_ENUM.ADMIN ||
    role === ENTITIES_ROLE_ENUM.EDITOR
  ) {
    return (
      <>
        <CreateSchedule update={update} />
        <SubmitScore />
        <Games role={role} updated={updated} />
      </>
    );
  }
  return (
    <>
      <SubmitScore />
      <Games role={role} updated={updated} />
    </>
  );
}
