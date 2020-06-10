import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Organizations.module.css';
import { Avatar, List, Paper } from '../../../../components/Custom';
import CardHeader from '@material-ui/core/CardHeader';
import api from '../../../../actions/api';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function Organizations(props) {
  const { t } = useTranslation();

  const [organizations, setOrganizations] = useState([]);
  const getOrganizations = async () => {
    const { data } = await api(`/api/organizations`);

    setOrganizations(data);
  };

  getOrganizations();

  return (
    <Paper className={styles.card}>
      <CardHeader title={t('organizations')} />
      <List
        items={organizations.map(organization => ({
          value: organization.name,
          onClick: () =>
            goTo(ROUTES.organization, { id: organization.id }),
          iconComponent: <Avatar photoUrl={organization.photoUrl} />,
        }))}
      />
    </Paper>
  );
}
