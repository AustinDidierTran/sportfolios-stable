import React, { useState } from 'react';
import styles from './Rosters.module.css';
import RosterCard from '../RosterCard';

export default function Rosters(props) {
  const {
    isEventAdmin,
    rosters,
    onAdd,
    onDelete,
    onRoleUpdate,
    update,
  } = props;
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!rosters || !rosters.length) {
    // TODO: It should say there are no rosters [WCS-372]

    return null;
  }

  return (
    <div className={styles.contain}>
      {rosters.map((roster, index) => (
        <RosterCard
          isEventAdmin={isEventAdmin}
          roster={roster}
          expandedIndex={expandedIndex}
          setExpandedIndex={setExpandedIndex}
          onAdd={onAdd}
          onDelete={onDelete}
          onRoleUpdate={(...args) =>
            onRoleUpdate(roster.teamId, ...args)
          }
          index={index + 1}
          key={roster.rosterId}
          update={update}
        />
      ))}
    </div>
  );
}
