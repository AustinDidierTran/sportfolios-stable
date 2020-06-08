import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import { Avatar, List, Paper } from '../../../../components/Custom';
import CardHeader from '@material-ui/core/CardHeader';
import history from '../../../../stores/history';
import api from '../../../../actions/api';

export default function Organizations(props) {
  const { t } = useTranslation();

  const [organizations, setOrganizations] = useState([]);

  const getOrganizations = async () => {
    const { data } = await api(`/api/organizations`); //TO BE CHANGED

    setOrganizations(data);
  };

  getOrganizations();

  const [organizations, setOrganizations] = useState([]);

  const getOrganizations = async () => {
    const { data } = await api(`/api/organizations`); //TO BE CHANGED

    setOrganizations(data);
  };

  getOrganizations();

  return (
    <Paper className={styles.card}>
      <CardHeader title={t('organizations')} />
      <List
        items={organizations.map(organization => ({
          value: organization.name,
          onClick: () => goTo(ROUTES.organization, organization.id),
          iconComponent: <Avatar photoUrl={organization.photoUrl} />,
        }))}
      />
    </Paper>
  );
}
