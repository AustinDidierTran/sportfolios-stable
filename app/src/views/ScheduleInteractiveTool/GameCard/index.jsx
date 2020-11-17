import React, { useMemo } from 'react';
import { Tooltip } from '@material-ui/core';
import { Card, Typography } from '../../../components/MUI';
import { Avatar } from '../../../components/Custom';
import styles from './GameCard.module.css';
import {
  formatDate,
  getInitialsFromName,
} from '../../../utils/stringFormats';
import moment from 'moment';

export default function GamCard(props) {
  const { team1, team2, timeSlots, fields, x, y } = props;

  const tooltip = useMemo(
    () =>
      `${team1} vs ${team2}, ${fields[x]?.field}, ${formatDate(
        moment(timeSlots[y]?.date),
        'DD MMM HH:mm',
      )}`,
    [x, y],
  );

  return (
    <Card
      className={styles.gameCard}
      unselectable="on"
      // hack for firefox
      // Firefox requires some kind of initialization
      // which we can do by adding this attribute
      // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
      onDragStart={e => e.dataTransfer.setData('text/plain', '')}
    >
      <Tooltip title={tooltip} enterDelay={500}>
        <div className={styles.gameDiv}>
          <div className={styles.team1}>
            <Avatar
              initials={getInitialsFromName(team1)} // or team pic?
            ></Avatar>
          </div>
          <Typography className={styles.vs}>vs</Typography>
          <div className={styles.team2}>
            <Avatar
              initials={getInitialsFromName(team2)} // or team pic?
            ></Avatar>
          </div>
        </div>
      </Tooltip>
    </Card>
  );
}
