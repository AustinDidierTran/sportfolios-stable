import React from 'react';

import styles from './GameItem.module.css';

import { Typography, Card } from '../../../MUI';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import { ListItemText } from '@material-ui/core';
import TwoTeamGame from './TwoTeamGame';

export default function GameItem(props) {
  const { teams, field, start_time: startTime, phaseName } = props;
  if (teams.length === 2) {
    return (
      <TwoTeamGame
        team1={teams[0]}
        team2={teams[1]}
        field={field}
        startTime={startTime}
        phaseName={phaseName}
      />
    );
  }
  return (
    <Card className={styles.game}>
      <div className={styles.main}>
        <Typography className={styles.phase} color="textSecondary">
          {phaseName}
        </Typography>
        <ListItemText
          className={styles.time}
          primary={formatDate(moment(startTime), 'h:mm')}
          secondary={formatDate(moment(startTime), 'ddd')}
        ></ListItemText>
        <Typography className={styles.field} color="textSecondary">
          {field}
        </Typography>
      </div>
      {teams.map(team => (
        <div className={styles.teams}>
          <Typography className={styles.name}>{team.name}</Typography>
          <Typography className={styles.score}>
            {team.score}
          </Typography>
        </div>
      ))}
    </Card>
  );
}
