import React from 'react';

import styles from './GameItem.module.css';

import { Typography, Card } from '../../../MUI';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';

export default function GameItem(props) {
  const { teams, field, start_time: startTime, phaseName } = props;
  return (
    <Card className={styles.game}>
      <div className={styles.main}>
        <Typography className={styles.field}>{field}</Typography>
        <Typography className={styles.phase}>{phaseName}</Typography>
        <Typography className={styles.time}>
          {formatDate(moment(startTime), 'h:mm ddd')}
        </Typography>
      </div>
      {teams.map(team => (
        <div className={styles.team}>
          <Typography className={styles.name} variant="h6">
            {team.name}
          </Typography>
          <Typography className={styles.score} variant="h6">
            {team.score}
          </Typography>
        </div>
      ))}
    </Card>
  );
}
