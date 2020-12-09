import React from 'react';

import styles from './TwoTeamGameEditable.module.css';

import { Typography, Card } from '../../../MUI';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import { ListItemText } from '@material-ui/core';

import { IconButton } from '../..';
import { useTranslation } from 'react-i18next';

export default function TwoTeamGameEditable(props) {
  const { t } = useTranslation();
  const {
    teams,
    field,
    start_time,
    phaseName,
    onClick,
    onEdit,
    onDelete,
  } = props;

  const team1 = teams[0];
  const team2 = teams[1];

  return (
    <Card className={styles.gameEdit}>
      <div onClick={onClick}>
        <div className={styles.main}>
          <Typography className={styles.phase} color="textSecondary">
            {phaseName}
          </Typography>
          <ListItemText
            className={styles.time}
            primary={formatDate(moment(start_time), 'HH:mm')}
            secondary={formatDate(moment(start_time), 'D MMM')}
          ></ListItemText>
          <Typography className={styles.field} color="textSecondary">
            {field}
          </Typography>
        </div>
        <div className={styles.teams}>
          <Typography className={styles.name1}>
            {team1.name}
          </Typography>
          <Typography className={styles.score1}>
            {team1.score}
          </Typography>
          <Typography className={styles.union}>-</Typography>
          <Typography className={styles.name2}>
            {team2.name}
          </Typography>
          <Typography className={styles.score2}>
            {team2.score}
          </Typography>
        </div>
      </div>
      {onEdit ? (
        <div className={styles.buttonsContainer}>
          <IconButton
            className={styles.icon}
            onClick={onEdit}
            tooltip={t('edit_game')}
            icon="Edit"
            style={{ color: 'primary' }}
          />
          <IconButton
            className={styles.icon}
            onClick={onDelete}
            tooltip={t('delete')}
            icon="Delete"
            style={{ color: 'primary' }}
          />
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <IconButton
            className={styles.icon}
            onClick={onDelete}
            tooltip={t('delete')}
            icon="Delete"
            style={{ color: 'primary' }}
          />
        </div>
      )}
    </Card>
  );
}
