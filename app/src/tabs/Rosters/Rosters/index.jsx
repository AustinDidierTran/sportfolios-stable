import React, { useState } from 'react';
import styles from './Rosters.module.css';
import RosterCard from '../RosterCard';
import { ROSTER_ROLE_ENUM } from '../../../../../common/enums';
import MyRosterCard from '../MyRosterCard';

export default function Rosters(props) {
  const { rosters, onAdd, onDelete } = props;
  const [expandedPosition, setExpandedPosition] = useState(0);

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
              expandedPosition={expandedPosition}
              setExpandedPosition={setExpandedPosition}
              onAdd={onAdd}
              onDelete={onDelete}
              index={index}
            />
          );
        }

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
