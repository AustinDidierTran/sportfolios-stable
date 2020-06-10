import React, { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './OrganizationList.module.css';
import { Avatar, Paper, List, Button } from '../../components/Custom';
import { Typography } from '../../components/MUI';
import { goTo, ROUTES } from '../../actions/goTo';
import api from '../../actions/api';

import history from '../../stores/history';

export default function OrganizationList(props) {
  const { t } = useTranslation();

  const [organizations, setOrganizations] = useState([]);

  const getOrganizations = async () => {
    const { data } = await api(`/api/organizations`);

    setOrganizations(data);
  };

  getOrganizations();

  const handleClick = () => {
    history.push(ROUTES.createOrganization);
  };

  return (
    <Paper className={styles.card}>
      <Typography variant="h3" className={styles.title}>
        {t('organizations')}
      </Typography>
      <Button onClick={handleClick} className={styles.button}>
        {t('create_organization')}
      </Button>
      <List
        items={organizations.map(org => ({
          value: org.name,
          onClick: () => goTo(ROUTES.organization, { id: org.id }),
          iconComponent: <Avatar photoUrl={org.photoUrl} />,
        }))}
      />
    </Paper>
  );
}
