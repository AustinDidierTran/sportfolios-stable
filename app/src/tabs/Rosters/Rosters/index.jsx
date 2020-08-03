import React, { useState } from 'react';
import styles from './Rosters.module.css';
import RosterCard from '../RosterCard';

export default function Rosters(props) {
  const { rosters } = props;
  const [expandedPosition, setExpandedPosition] = useState(0);

  if (!rosters) {
    return null;
  }

  return (
    <div className={styles.contain}>
      {rosters.map(roster => {
        return (
          <RosterCard
            roster={roster}
            expandedPosition={expandedPosition}
            setExpandedPosition={setExpandedPosition}
          />
        );
      })}
    </div>
  );
}
