import React, { useMemo } from 'react';
import styles from './MyRosterCard.module.css';
import { Paper, Icon, Avatar } from '../../../components/Custom';

import Players from './Players';
import { Typography } from '../../../components/MUI';
import Tag from '../Tag';
import { ROSTER_ROLE_ENUM } from '../../../../../common/enums';

const isEven = n => {
  return n % 2 == 0;
};

export default function MyRosterCard(props) {
  const {
    roster,
    expandedIndex,
    setExpandedIndex,
    onDelete,
    onAdd,
    index,
    update,
  } = props;
  const {
    position,
    name,
    players,
    rosterId,
    role,
    registrationStatus,
  } = roster;

  const expanded = useMemo(() => expandedIndex === index, [
    expandedIndex,
    index,
  ]);

  const onExpand = () => {
    setExpandedIndex(oldIndex => (oldIndex === index ? 0 : index));
  };

  if (
    role == ROSTER_ROLE_ENUM.CAPTAIN ||
    role == ROSTER_ROLE_ENUM.PLAYER
  ) {
    return (
      <Paper className={styles.paper}>
        <div
          className={styles.card}
          style={
            isEven(index)
              ? { backgroundColor: '#19bf9d', color: '#fff' }
              : { backgroundColor: '#18B393', color: '#fff' }
          }
        >
          <div className={styles.default}>
            <div className={styles.position}>
              {position ? position : '-'}
            </div>
            <div className={styles.title} onClick={onExpand}>
              <div className={styles.name}>
                <Typography>{name.toUpperCase()}</Typography>
              </div>
              <Avatar
                className={styles.avatar}
                photoUrl={roster.photoUrl}
                size="sm"
              />
            </div>
            <div className={styles.pod}>
              <Tag type={registrationStatus} />
            </div>
            <div className={styles.expand} onClick={onExpand}>
              <Icon
                icon={
                  expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'
                }
              />
            </div>
            <div
              className={styles.expanded}
              hidden={!expanded}
              style={
                isEven(index)
                  ? {
                      borderBottomColor: '#19bf9d',
                      borderBottomWidth: '2px',
                      borderBottomStyle: 'solid',
                    }
                  : {
                      borderBottomColor: '#18B393',
                      borderBottomWidth: '2px',
                      borderBottomStyle: 'solid',
                    }
              }
            >
              <Players
                players={players}
                update={update}
                role={role}
                rosterId={rosterId}
                onDelete={onDelete}
                onAdd={onAdd}
              />
            </div>
          </div>
        </div>
      </Paper>
    );
  }

  return null;
}
