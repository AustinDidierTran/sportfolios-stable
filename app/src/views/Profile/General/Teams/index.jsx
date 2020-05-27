import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Teams.module.css';
import { Avatar, Paper } from '../../../../components/Custom';
import {
  TextField,
  List,
  ListItem,
} from '../../../../components/MUI';

import history from '../../../../stores/history';

import { getInitialsFromName } from '../../../../utils/stringFormats';

import CardHeader from '@material-ui/core/CardHeader';
import ListItemIcon from '@material-ui/core/ListItemIcon';

export default function Teams(props) {
  const { t } = useTranslation();
  const { isSelf, teams } = props;

  return (
    <Paper className={styles.card}>
      <CardHeader title={t('teams')} />
      <List disablePadding={true}>
        {teams.map((team, index) => {
          const { highlight, name } = team;
          return (
            <ListItem
              button
              key={index}
              onClick={() => history.push('/team')}
            >
              <ListItemIcon>
                <Avatar
                  initials={getInitialsFromName(name)}
                  photoUrl={null}
                />
              </ListItemIcon>
              <TextField
                disabled
                value={name}
                className={styles.textField}
              />
              <span className={styles.highlight}>{highlight}</span>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
