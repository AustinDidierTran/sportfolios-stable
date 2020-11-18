import React from 'react';
import { Typography, Card } from '../../../MUI';
import { Avatar } from '../../../Custom';
import {
  formatDate,
  getInitialsFromName,
} from '../../../../utils/stringFormats';
import { ListItemText, makeStyles } from '@material-ui/core';
import moment from 'moment';

import styles from './TwoTeamGameProfile.module.css';
import { AvatarGroup } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    fontSize: theme.spacing(1.5),
  },
}));

export default function TwoTeamGameProfile(props) {
  const classes = useStyles();
  const {
    event_id,
    event_name,
    field,
    timeslot,
    team_names,
    team_scores,
    playersinfos,
    onClick,
  } = props;
  const team1 = {
    name: team_names[0],
    score: team_scores[0],
    players: playersinfos[0],
  };
  const team2 = {
    name: team_names[1],
    score: team_scores[1],
    players: playersinfos[1],
  };

  return (
    <Card className={styles.gameCard}>
      <div className={styles.main} onClick={() => onClick(event_id)}>
        <Typography className={styles.event} color="textSecondary">
          {event_name}
        </Typography>
        <ListItemText
          className={styles.time}
          primary={formatDate(moment(timeslot), 'HH:mm')}
          secondary={formatDate(moment(timeslot), 'D MMM')}
        ></ListItemText>
        <Typography className={styles.field} color="textSecondary">
          {field}
        </Typography>

        <AvatarGroup
          className={styles.players1}
          classes={{ avatar: classes.avatar }}
          max={4}
        >
          {team1.players
            ? team1.players.map((p, index) => (
                <Avatar
                  key={`team1-${index}`}
                  className={styles.bubbleStack}
                  photoUrl={p.photo}
                  initials={getInitialsFromName({
                    name: p?.name,
                    surname: p?.surname,
                  })}
                />
              ))
            : undefined}
        </AvatarGroup>
        <AvatarGroup
          className={styles.players2}
          classes={{ avatar: classes.avatar }}
          max={4}
        >
          {team2.players
            ? team2.players.map((p, index) => (
                <Avatar
                  key={`team2-${index}`}
                  className={styles.bubbleStack}
                  photoUrl={p.photo}
                  initials={getInitialsFromName({
                    name: p?.name,
                    surname: p?.surname,
                  })}
                />
              ))
            : undefined}
        </AvatarGroup>

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
