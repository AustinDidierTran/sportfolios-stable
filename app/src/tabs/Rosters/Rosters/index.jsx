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
  const onExpand = index => {
    setExpandedIndex(index);
  };
  if (!rosters || !rosters.length) {
    // TODO: It should say there are no rosters [WCS-372]

    return null;
  }

  return (
    <div className={styles.contain}>
      {rosters.map((roster, index) => (
        <RosterCard
          onExpand={onExpand}
          expanded={expandedIndex === index}
          isEventAdmin={isEventAdmin}
          roster={roster}
          onAdd={onAdd}
          onDelete={onDelete}
          onRoleUpdate={(...args) =>
            onRoleUpdate(roster.teamId, ...args)
          }
          index={index}
          key={roster.rosterId}
          update={update}
        />
      ))}
    </div>
  );
}
