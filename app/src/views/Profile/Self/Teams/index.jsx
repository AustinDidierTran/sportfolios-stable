import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Teams.module.css';
import { Avatar } from '../../../../components/Custom';
import {
  TextField,
  Card,
  List,
  ListItem,
  ListItemIcon,
} from '../../../../components/MUI';
import CardHeader from '@material-ui/core/CardHeader';

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
            value={"Nom de l'équipe"}
            className={styles.textField}
          />
        </ListItem>
      </List>
    </Card>
  );
}
