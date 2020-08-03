import React, { useState, useEffect } from 'react';
import styles from './RosterCard.module.css';
import { Paper, Icon } from '../../../components/Custom';

import Players from './Players';
import { Typography } from '../../../components/MUI';
import Tag from '../Tag';
import { ENTITIES_ROLE_ENUM } from '../../../../../common/enums';

const isEven = n => {
  return n % 2 == 0;
};

export default function RosterCard(props) {
  const { roster, expandedPosition, setExpandedPosition } = props;
  const { position, name, players } = roster;
  const [expanded, setExpanded] = useState(false);
  const { role, registrationStatus } = roster;

  const onExpand = () => {
    setExpandedPosition(oldPosition =>
      oldPosition === position ? 0 : position,
    );
  };

  useEffect(() => {
    if (expandedPosition == position) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [expandedPosition]);

  if (role == ENTITIES_ROLE_ENUM.ADMIN) {
    return (
      <Paper className={styles.paper}>
        <div
          className={styles.card}
          style={
            isEven(position) ? { backgroundColor: '#f2f2f2' } : {}
          }
          key={position}
          onClick={onExpand}
        >
          <div className={styles.default}>
            <div className={styles.position}>{position}</div>
            <div className={styles.name}>
              <Typography>{name.toUpperCase()}</Typography>
            </div>
            <div className={styles.pod}>
              <Tag type={registrationStatus} />
            </div>
            <div className={styles.expand} onClick={onExpand}>
              <Icon
                onClick={onExpand}
                icon={
                  expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'
                }
              />
            </div>
            <div className={styles.expanded} hidden={!expanded}>
              <Players players={players} role={role} />
            </div>
          </div>
        </div>
      </Paper>
    );
  }

  return (
    <Paper className={styles.paper}>
      <div
        className={styles.card}
        style={isEven(position) ? { backgroundColor: '#f2f2f2' } : {}}
        key={position}
        onClick={onExpand}
      >
        <div className={styles.default}>
          <div className={styles.position}>{position}</div>
          <div className={styles.name}>
            <Typography>{name.toUpperCase()}</Typography>
          </div>
          <div className={styles.expand} onClick={onExpand}>
            <Icon
              onClick={onExpand}
              icon={
                expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'
              }
            />
          </div>
          <div className={styles.expanded} hidden={!expanded}>
            <Players players={players} />
          </div>
        </div>
      </div>
    </Paper>
  );
}
