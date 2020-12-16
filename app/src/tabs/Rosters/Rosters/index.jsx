import React, { useState } from 'react';
import styles from './Rosters.module.css';
import RosterCard from '../RosterCard';

export default function Rosters(props) {
  const { isEventAdmin, rosters, update } = props;
  const [expandedIndex, setExpandedIndex] = useState();
  const onExpand = index => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
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
          index={index}
          key={roster.rosterId}
          update={update}
        />
      ))}
    </div>
  );
}
