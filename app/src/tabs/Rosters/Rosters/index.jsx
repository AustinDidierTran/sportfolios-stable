import React, { useState } from 'react';
import styles from './Rosters.module.css';
import RosterCard from '../RosterCard';

export default function Rosters(props) {
  const { rosters } = props;
  const [expandedPosition, setExpandedPosition] = useState(0);

  return (
    <div className={styles.contain}>
      {rosters.map((roster, index) => {
        return (
          <RosterCard
            roster={{ ...roster, position: index + 1 }}
            expandedPosition={expandedPosition}
            setExpandedPosition={setExpandedPosition}
          />
        );
      })}
    </div>
  );
}
