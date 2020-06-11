import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Teams.module.css';
import { Avatar, Paper } from '../../../../../components/Custom';
import {
  TextField,
  List,
  ListItem,
} from '../../../../../components/MUI';

import history from '../../../../../stores/history';

import { getInitialsFromName } from '../../../../../utils/stringFormats';

import ListItemIcon from '@material-ui/core/ListItemIcon';

export default function Teams(props) {
  const { t } = useTranslation();
  const { teams } = props;

  return (
    <Paper className={styles.card} title={t('teams')}>
      <List disablePadding>
        {teams.map((team, index) => {
          const { highlight, name, photoUrl } = team;
          return (
            <ListItem
              button
              key={index}
              onClick={() => history.push('/team')}
            >
              <ListItemIcon>
                <Avatar
                  initials={getInitialsFromName(name)}
                  photoUrl={photoUrl}
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
