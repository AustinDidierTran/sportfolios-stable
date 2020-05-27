import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import { Avatar, List, Paper } from '../../../../components/Custom';
import { TextField, ListItem } from '../../../../components/MUI';
import CardHeader from '@material-ui/core/CardHeader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { getInitialsFromName } from '../../../../utils/stringFormats';
import history from '../../../../stores/history';

export default function Organizations(props) {
  const { t } = useTranslation();
  const { isSelf, organizations } = props;
  const [privacy, setPrivacy] = useState('public');

  const handleChange = event => {
    setPrivacy(event.target.value);
  };

  return (
    <Paper className={styles.card}>
      <CardHeader title={t('organizations')} />
      <List
        items={organizations.map(organization => ({
          value: organization.name,
          onClick: () => history.push('/organization'),
          iconComponent: (
            <Avatar
              initials={organization.initials}
              photoUrl={organization.photoUrl}
            />
          ),
        }))}
      />
    </Paper>
  );
}
