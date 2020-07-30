import React, { useState } from 'react';
import styles from './RosterCard.module.css';
import { Paper, Icon } from '../../../components/Custom';

import Players from './Players';

function isEven(n) {
  return n % 2 == 0;
}

export default function RosterCard(props) {
  const { roster, position, initialExpanded } = props;
  const [expanded, setExpanded] = useState(initialExpanded);

  const onExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper className={styles.paper}>
      <div
        className={styles.card}
        style={
          isEven(position) ? { backgroundColor: 'lightgrey' } : {}
        }
        key={position}
        onClick={onExpand}
      >
        <div className={styles.default}>
          <div className={styles.position}>{position}</div>
          <div className={styles.name}>
            {(roster && roster.name) || 'MY ROSTER'}
          </div>
          <div className={styles.pod}>{'POD'}</div>
          <div className={styles.expand} onClick={onExpand}>
            <Icon icon="KeyboardArrowDown" />
          </div>
          <div className={styles.expanded} hidden={!expanded}>
            <Players players={(roster && roster.players) || []} />
          </div>
        </div>
      </div>
    </Paper>
  );
}
