import React, { useState } from 'react';
import EditGames from './EditGames';
import CreateSchedule from './CreateSchedule';

export default function EditScheduleTab() {
  const [updated, setUpdated] = useState(true);

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
