import React from 'react';

import styles from './GameItem.module.css';

import { Typography, Card } from '../../../MUI';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import { ListItemText } from '@material-ui/core';

export default function GameItem(props) {
  const { teams, field, start_time: startTime, phaseName } = props;

  const team1 = teams[0];
  const team2 = teams[1];

  return (
    <Card className={styles.game}>
      <div className={styles.main}>
        <Typography className={styles.phase} color="textSecondary">
          {phaseName}
        </Typography>
        <ListItemText
          className={styles.name}
          primary={formatDate(moment(startTime), 'h:mm')}
          secondary={formatDate(moment(startTime), 'ddd')}
        ></ListItemText>
        <Typography className={styles.field} color="textSecondary">
          {field}
        </Typography>
      </div>
      <div className={styles.teams}>
        <Typography className={styles.name1}>{team1.name}</Typography>
        <Typography className={styles.score1}>
          {team1.score}
        </Typography>
        <Typography className={styles.union}>-</Typography>
        <Typography className={styles.name2}>{team2.name}</Typography>
        <Typography className={styles.score2}>
          {team2.score}
        </Typography>
      </div>
    </Card>
  );
}
