import React from 'react';

import styles from './TwoTeamGame.module.css';

import { Typography, Card } from '../../../../MUI';
import { formatDate } from '../../../../../utils/stringFormats';
import moment from 'moment';
import { ListItemText } from '@material-ui/core';

import { ENTITIES_ROLE_ENUM } from '../../../../../../../common/enums';
import { IconButton } from '../../../../Custom';
import { useTranslation } from 'react-i18next';

export default function TwoTeamGame(props) {
  const { t } = useTranslation();
  const {
    team1,
    team2,
    field,
    startTime,
    phaseName,
    role,
    onClick,
    onEdit,
    onDelete,
  } = props;
  if (role === ENTITIES_ROLE_ENUM.ADMIN) {
    return (
      <Card className={styles.gameEdit}>
        <div onClick={onClick}>
          <div className={styles.main}>
            <Typography
              className={styles.phase}
              color="textSecondary"
            >
              {phaseName}
            </Typography>
            <ListItemText
              className={styles.time}
              primary={formatDate(moment(startTime), 'HH:mm')}
              secondary={formatDate(moment(startTime), 'ddd')}
            ></ListItemText>
            <Typography
              className={styles.field}
              color="textSecondary"
            >
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
      </Card>
    );
  }

  return (
    <Card className={styles.game}>
      <div className={styles.main} onClick={onClick}>
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
