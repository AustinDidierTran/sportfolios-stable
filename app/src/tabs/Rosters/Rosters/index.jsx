import React, { useState } from 'react';
import styles from './Rosters.module.css';
import RosterCard from '../RosterCard';
import { ROSTER_ROLE_ENUM } from '../../../../../common/enums';
import MyRosterCard from '../MyRosterCard';

export default function Rosters(props) {
  const { rosters, onAdd, onDelete } = props;
  const [expandedIndex, setExpandedIndex] = useState(0);

  if (!rosters || !rosters.length) {
    // TODO: It should say there are no rosters [WCS-372]

    return null;
  }

  return (
    <div className={styles.contain}>
      {rosters.map((roster, index) => {
        if (
          [
            ROSTER_ROLE_ENUM.CAPTAIN,
            ROSTER_ROLE_ENUM.PLAYER,
          ].includes(roster.role)
        ) {
          return (
            <MyRosterCard
              roster={roster}
              expandedIndex={expandedIndex}
              setExpandedIndex={setExpandedIndex}
              onAdd={onAdd}
              onDelete={onDelete}
              index={index + 1}
            />
          );
        }

        return (
          <RosterCard
            roster={roster}
            expandedIndex={expandedIndex}
            setExpandedIndex={setExpandedIndex}
            index={index + 1}
          />
        );
      })}
    </div>
  );
}
