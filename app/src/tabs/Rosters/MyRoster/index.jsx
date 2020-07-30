import React from 'react';

import MyRosterCard from '../MyRosterCard';

export default function MyRoster(props) {
  const { roster } = props;
  return (
    <div>
      <MyRosterCard roster={roster} />
    </div>
  );
}
