import React from 'react';

import styles from './GameItem.module.css';

import { Typography, Card } from '../../../MUI';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import { ListItemText } from '@material-ui/core';

export default function GameItem(props) {
  const { teams, field, start_time: startTime, phaseName } = props;

  return (
    <Card className={styles.game}>
      <div className={styles.main}>
        <Typography className={styles.phase} color="textSecondary">
          {phaseName}
        </Typography>
        <ListItemText
          className={styles.time}
          primary={formatDate(moment(startTime), 'HH:mm')}
          secondary={formatDate(moment(startTime), 'ddd')}
        ></ListItemText>
        <Typography className={styles.field} color="textSecondary">
          {field}
        </Typography>
      </div>
      {teams.map((team, index) => (
        <div className={styles.teams} key={index}>
          <Typography className={styles.name}>{team.name}</Typography>
          <Typography className={styles.score}>
            {team.score}
          </Typography>
        </div>
      ))}
    </Card>
  );
}
