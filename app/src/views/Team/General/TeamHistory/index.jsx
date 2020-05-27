import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './TeamHistory.module.css';
import {
  List,
  ListItem,
  Typography,
} from '../../../../components/MUI';
import { Paper } from '../../../../components/Custom';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EmojiEvents from '@material-ui/icons/EmojiEvents';
import { FormHelperText } from '@material-ui/core';

export default function AthleteHistory(props) {
  const { t } = useTranslation();

  const data = [
    {
      position: 1,
      event: 'Frisbee Fest',
      year: '2019',
    },
    {
      position: 11,
      event: 'CUC',
      year: '2018',
    },
  ];

  const formText = (position, event, year) => {
    return position + 'eme Place ' + event + ' ' + year;
  };

  return (
    <Paper className={styles.card}>
      <Typography variant="h4" className={styles.title}>
        {t('team_history')}{' '}
      </Typography>
      <List>
        {data.map(event => (
          <ListItem>
            <ListItemIcon>
              <EmojiEvents />
            </ListItemIcon>
            <ListItemText
              primary={formText(
                event.position,
                event.event,
                event.year,
              )}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
