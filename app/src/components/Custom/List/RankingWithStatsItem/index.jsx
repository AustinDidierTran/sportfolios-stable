import React from 'react';

import { ListItem, ListItemText } from '../../../MUI';
import styles from './RankingWithStatsItem.module.css';
import Divider from '@material-ui/core/Divider';

export default function RankingWithStatsItem(props) {
  const {
    index,
    name,
    wins = 0,
    loses = 0,
    pointFor = 0,
    pointAgainst = 0,
    withoutPosition,
  } = props;

  return (
    <>
      <ListItem style={{ width: '100%' }}>
        <div className={styles.main} style={{ width: '100%' }}>
          {withoutPosition ? (
            <ListItemText className={styles.position} secondary="-" />
          ) : (
            <ListItemText
              className={styles.position}
              secondary={index + 1}
            />
          )}

          <ListItemText className={styles.name} primary={name} />
          <ListItemText
            className={styles.wins}
            primary={wins}
            secondary="W"
          />
          <ListItemText
            className={styles.loses}
            primary={loses}
            secondary="L"
          />
          <ListItemText
            className={styles.pointFor}
            primary={pointFor}
            secondary="+"
          />
          <ListItemText
            className={styles.pointAgainst}
            primary={pointAgainst}
            secondary="-"
          />
          <ListItemText
            className={styles.diff}
            primary={pointFor - pointAgainst}
            secondary="+/-"
          />
        </div>
      </ListItem>
      <Divider />
    </>
  );
}
