import React from 'react';

import styles from './GameItem.module.css';

import { Typography, Card, TextField } from '../../../MUI';
import { useFormInput } from '../../../../hooks/forms';
import { useEffect } from 'react';

export default function GameItem(props) {
  const {
    teams,
    changeScore,
    saveGame,
    gameIndex,
    field,
    time,
  } = props;

  const fieldInput = useFormInput(field);
  const timeInput = useFormInput(time);

  const theTeams = teams.map(team => {
    return { ...team, input: useFormInput(team.score) };
  });

  const saveScore = () => {
    theTeams.map((team, teamIndex) => {
      if (team.input.hasChanged) {
        team.input.setCurrentAsDefault();
        changeScore(gameIndex, teamIndex, team.input.value);
      }
    });
  };

  const save = () => {
    if (fieldInput.hasChanged || timeInput.hasChanged) {
      saveGame(gameIndex, fieldInput.value, timeInput.value);
    }
  };

  useEffect(() => saveScore(), [theTeams]);
  useEffect(() => save(), [fieldInput.value, timeInput.value]);

  return (
    <Card className={styles.game}>
      <div className={styles.main}>
        <TextField
          className={styles.field}
          {...fieldInput.inputProps}
          variant="outlined"
          size="small"
        />
        <TextField
          variant="outlined"
          size="small"
          className={styles.time}
          {...timeInput.inputProps}
        />
      </div>
      {theTeams.map(team => (
        <div className={styles.team}>
          <Typography className={styles.name} variant="h6">
            {team.name}
          </Typography>
          <TextField
            className={styles.score}
            type="number"
            {...team.input.inputProps}
          />
        </div>
      ))}
    </Card>
  );
}
