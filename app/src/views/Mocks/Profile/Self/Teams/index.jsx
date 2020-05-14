import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Teams.module.css';
import {
  TextField,
  Card,
  List,
  ListItem,
  ListItemIcon,
} from '../../../../../components/MUI';
import CardHeader from '@material-ui/core/CardHeader';
import { Avatar } from '../../../../../components/Custom';

export default function Teams(props) {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <CardHeader title={t('teams')} />
      <List>
        <ListItem>
          <ListItemIcon>
            <Avatar
              className={styles.avatar}
              initials={'SGC'}
              photoUrl={null}
            />
          </ListItemIcon>
          <TextField
            disabled
            value={"Sherbrooke Gentlemen's Club"}
            className={styles.textField}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Avatar
              className={styles.avatar}
              initials={'LL'}
              photoUrl={null}
            />
          </ListItemIcon>
          <TextField
            disabled
            value={'Louis Luncheonette'}
            className={styles.textField}
          />
        </ListItem>
      </List>
    </Card>
  );
}
