import React, { useState } from 'react';
import AllEditGames from './AllEditGames';
import CreateSchedule from './CreateSchedule';

export default function EditScheduleTab() {
  const [updated, setUpdated] = useState(true);

  const update = () => {
    setUpdated(!updated);
  };

  return (
    <>
      <CreateSchedule update={update} />
      <AllEditGames updated={updated} />
    </>
  );
}
