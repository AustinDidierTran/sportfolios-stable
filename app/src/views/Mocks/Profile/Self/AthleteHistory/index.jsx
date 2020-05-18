import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './AthleteHistory.module.css';
import { Card, List, ListItem } from '../../../../../components/MUI';

import CardHeader from '@material-ui/core/CardHeader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EmojiEvents from '@material-ui/icons/EmojiEvents';

export default function AthleteHistory(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <CardHeader title={t('athlete_history')} />
      <List>
        <ListItem>
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText primary="1ere Place C4UC Louis Luncheonette 2019" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText primary="11eme Place CUC Sherbrooke Gentlemen's Club 2018" />
        </ListItem>
      </List>
    </Card>
  );
}
