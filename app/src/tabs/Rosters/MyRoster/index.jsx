import React, { useState } from 'react';

import MyRosterCard from '../MyRosterCard';

export default function MyRoster(props) {
  const { rosters, onDelete, onAdd } = props;
  const [expandedPosition, setExpandedPosition] = useState(1);

  return (
    <div>
      {rosters &&
        rosters.length &&
        rosters.map((roster, index) => {
          return (
            <MyRosterCard
              roster={roster}
              expandedPosition={expandedPosition}
              setExpandedPosition={setExpandedPosition}
              onDelete={onDelete}
              onAdd={onAdd}
              index={index}
            />
          );
        })}
    </div>
  );
}
